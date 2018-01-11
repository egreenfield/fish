// include the Adafruit motor shield library
#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_MS_PWMServoDriver.h"


//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
const int SoundInPin = A0;
const int dialPin = A2;

const int kNoiseThreshold = 275;
const int kSilenceThreshold = 150;
const int kReactivateThreshold = 275;
const int kJawTime = 200;
const int kSilenceTrigger = 20;
const int kSleepTrigger = 10000;
const int kRangeResetTrigger = 1000;

const int kPrintOut = 0;
const int kPrintInterval = 100;

const int waiting = 0;
const int talking = 1;
const int finishing = 2;
const int goingToSleep = 3;


//-------------------------------------------------------------------------------------------
// state
//-------------------------------------------------------------------------------------------

int mouthPos = 0;
int headPos = 0;
int tailPos = 0;
int talkStartTime;

int state = waiting;
int noiseCount = 0;
int silenceCount = 0;
int globalCount = 0;
bool lastHeardNoise = false;
bool lastHeardSilence = false;

// the loop routine runs over and over again forever:
int minV = 10000;
int maxV = 0;
int rangeCount = 0;


//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

// connect to the motors
Adafruit_MotorShield AFMS = Adafruit_MotorShield();
Adafruit_DCMotor *mouthMotor = AFMS.getMotor(1);
Adafruit_DCMotor *body = AFMS.getMotor(2);
Adafruit_DCMotor *tail = AFMS.getMotor(3);

// the setup routine runs once when you press reset:
void setup() {
  Serial.begin(9600);
  Serial.println("Hello world");


  AFMS.begin(64000);  
  
  // Set the speed to start, from 0 (off) to 255 (max speed)
  mouthMotor->setSpeed(0); //mouth motor
  mouthMotor->run(FORWARD);
  mouthMotor->run(RELEASE);

  body->setSpeed(0);
  body->run(FORWARD);
  body->run(RELEASE);

}

//-------------------------------------------------------------------------------------------
// mouth control
//-------------------------------------------------------------------------------------------

void openMouth() {
  uint8_t i;
  if (mouthPos == 1)
    return;
  mouthPos = 1;
  mouthMotor->run(BACKWARD);
  mouthMotor->setSpeed(255);
}

void closeMouth() {
  uint8_t i;
  if (mouthPos == 0)
    return;
  mouthPos = 0;
  mouthMotor->run(FORWARD);
  mouthMotor->setSpeed(255);
}

void moveMouth() {
  int time = millis() - talkStartTime;
  int jawPos = time / kJawTime;
  if((jawPos % 2 == 0)) {
    openMouth();
  } else {
    int partial = (time % kJawTime) * 10 / kJawTime;
    if(partial > 5)
      closeMouth();
    else
      openMouth();
  }
}

//-------------------------------------------------------------------------------------------
// head/tail control
//-------------------------------------------------------------------------------------------

void setHead(int up) {
  uint8_t i;
  if (headPos == up)
    return;
  headPos = up;
  if (headPos)
    body->run(BACKWARD);
  else
    body->run(FORWARD);
  body->setSpeed(255);
}


void setTail(int up) {
  uint8_t i;
  if (tailPos == up)
    return;
  tailPos = up;
  if (tailPos)
    tail->run(FORWARD);
  else
    tail->run(BACKWARD);

  for (i = 140; i < 255; i++) {
    tail->setSpeed(i);
  }
}

void goToSleep() {
  stopAllMotors();
}

void stopAllMotors() {

  mouthMotor->run(RELEASE);
  body->run(RELEASE);
  tail->run(RELEASE);
}

//-------------------------------------------------------------------------------------------


void loop() {
  // increment the loop count
  globalCount++;
  
  // read the input on analog pin 0:
  int audioSensorValue = analogRead(SoundInPin);

  // update min/max sensor values for diagnostics
  rangeCount++;
  if(rangeCount > kRangeResetTrigger) {
    minV = 10000;
    maxV = 0;
    rangeCount = 0;      
  }
  minV = min(audioSensorValue,minV);
  maxV = max(audioSensorValue,maxV);
  char buffer[255];


  // check to see if the audio sensor is above the noise threshold
  bool hearNoise = (audioSensorValue > kNoiseThreshold);
  if(lastHeardNoise == hearNoise) {
    noiseCount++;
  } else {
    noiseCount = 1;
    lastHeardNoise = hearNoise;
  }

  // check to see if the audio sensor is below the silence threshold
  bool hearSilence = (audioSensorValue <= kSilenceThreshold);
  if(lastHeardSilence == hearSilence) {
    silenceCount++;
  } else {
    silenceCount = 1;
    lastHeardSilence = hearSilence;
  }

  // check to see if the audio sensor is above the reactivation threshold
  bool reactivateSound = (audioSensorValue > kReactivateThreshold);

  // now update state.
  switch(state) {
    case waiting:
      if(hearNoise) {
        talkStartTime = millis();
        state = talking;
      }
      break;
    case talking:
      if(hearSilence && silenceCount > kSilenceTrigger)
        state = finishing;
      break;
    case finishing:
      if(reactivateSound)
        state = talking;
      else if (hearNoise == false && noiseCount > kSleepTrigger)
        state = goingToSleep;
      break;
    case goingToSleep:
      state = waiting;
      break;
  }

  if(kPrintOut && (globalCount % kPrintInterval) == 0) {
    sprintf(buffer,"s:(%d) v:%4d | noise:%d, %d | silence:%d, %d | range:(%d - %d) - %d",state,audioSensorValue,hearNoise + 0,noiseCount,hearSilence + 0,silenceCount,minV,maxV,rangeCount);
    Serial.println(buffer);
  }

  // take action based on current state.
  switch(state) {
    case waiting:
      break;
    case talking:
      setHead(1);
      moveMouth();
      break;
    case finishing:
      setHead(1);
      closeMouth();
      break;      
    case goingToSleep:
      setHead(0);
      closeMouth();
      goToSleep();
      break;
  }
}


