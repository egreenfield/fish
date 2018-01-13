import { Board, Motor, Sensor } from "johnny-five";
//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
//TODO check sound in pin
const SoundInPin = "A0";

const kNoiseThreshold = 275;
const kSilenceThreshold = 150;
const kReactivateThreshold = 275;
const kJawTime = 200;
const kSilenceTrigger = 20;
const kSleepTrigger = 10000;
const kRangeResetTrigger = 1000;

const kPrintOut = 0;
const kPrintInterval = 100;

const waiting = 0;
const talking = 1;
const finishing = 2;
const goingToSleep = 3;

//-------------------------------------------------------------------------------------------
// state
//-------------------------------------------------------------------------------------------

let mouthPos = 0;
let headPos = 0;
let tailPos = 0;
let talkStartTime = 0;

let state = waiting;
let noiseCount = 0;
let silenceCount = 0;
let globalCount = 0;
let lastHeardNoise = false;
let lastHeardSilence = false;

// the loop routine runs over and over again forever:
let minV = 10000;
let maxV = 0;
let rangeCount = 0;

let board: Board;
let mouth: Motor;
let body: Motor;
let soundIn: Sensor;

//-------------------------------------------------------------------------------------------
// mouth control
//-------------------------------------------------------------------------------------------

function openMouth() {
  if (mouthPos == 1) return;
  mouthPos = 1;
  mouth.reverse(255);
  //TODO is 255 the right number?
}

function closeMouth() {
  if (mouthPos == 0) return;
  mouthPos = 0;
  //TODO is 255 the right number?
  mouth.forward(255);
}

function moveMouth() {
  let time: number = new Date().getTime() - talkStartTime;
  let jawPos = time / kJawTime;
  if (jawPos % 2 == 0) {
    openMouth();
  } else {
    let partial = (time % kJawTime) * 10 / kJawTime;
    if (partial > 5) closeMouth();
    else openMouth();
  }
}

//-------------------------------------------------------------------------------------------
// head/tail control
//-------------------------------------------------------------------------------------------

function setHead(up: number) {
  if (headPos == up) return;
  headPos = up;
  //TODO is 255 the right number?
  if (headPos) body.reverse(255);
  else body.forward(255);
}

function goToSleep() {
    mouth.stop();
    body.stop();
}

function updateMotorsFromAudio(audioSensorValue: number) {
  // increment the loop count
  globalCount++;

  // update min/max sensor values for diagnostics
  rangeCount++;
  if (rangeCount > kRangeResetTrigger) {
    minV = 10000;
    maxV = 0;
    rangeCount = 0;
  }
  minV = Math.min(audioSensorValue, minV);
  maxV = Math.max(audioSensorValue, maxV);

  // check to see if the audio sensor is above the noise threshold
  let hearNoise = audioSensorValue > kNoiseThreshold;
  if (lastHeardNoise == hearNoise) {
    noiseCount++;
  } else {
    noiseCount = 1;
    lastHeardNoise = hearNoise;
  }

  // check to see if the audio sensor is below the silence threshold
  let hearSilence = audioSensorValue <= kSilenceThreshold;
  if (lastHeardSilence == hearSilence) {
    silenceCount++;
  } else {
    silenceCount = 1;
    lastHeardSilence = hearSilence;
  }

  // check to see if the audio sensor is above the reactivation threshold
  let reactivateSound = audioSensorValue > kReactivateThreshold;

  // now update state.
  switch (state) {
    case waiting:
      if (hearNoise) {
        talkStartTime = new Date().getTime();
        state = talking;
      }
      break;
    case talking:
      // TODO change from count to timer, add timer callback
      if (hearSilence && silenceCount > kSilenceTrigger) {
        state = finishing;
      }
      break;
    case finishing:
      if (reactivateSound) {
        state = talking;
        // TODO change from count to timer, add timer callback
      } else if (hearNoise == false && noiseCount > kSleepTrigger) {
        state = goingToSleep;
      }
      break;
    case goingToSleep:
      state = waiting;
      break;
  }

  if (kPrintOut && globalCount % kPrintInterval == 0) {
    console.log(
      `s:(${state}) v:${audioSensorValue} | noise:${hearNoise}, ${noiseCount} | silence:${hearNoise}, ${silenceCount} | range:(${minV} - ${maxV}) - ${rangeCount}`
    );
  }

  // take action based on current state.
  switch (state) {
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

//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

// the setup routine runs once when you press reset:
function init() {
    board = new Board({
      //TODO: init with rpi info.
    });
    board.on("ready", () => {
      //TODO check motor pins.
      mouth = new Motor(["a5", "a4", "a3"] as any);
      body = new Motor(["a8", "a7", "a6"] as any);
      soundIn = new Sensor(SoundInPin);
      soundIn.on("change", () => {
        updateMotorsFromAudio(soundIn.value);
      });
  
      //TODO   AFMS.begin(64000);
      mouth.forward(0);
      mouth.stop();
  
      body.forward(0);
      body.stop();
    });
  }

  
init();