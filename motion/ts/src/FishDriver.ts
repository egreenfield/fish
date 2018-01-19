import { Board, Motor, Sensor } from "johnny-five";
//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
//TODO check sound in pin
const SoundInPin = "A0";

const kNoiseThreshold = 200;
const kSilenceThreshold = 175;
const kReactivateThreshold = 130;
const kJawTime = 200;
const kTimeUntilFinishing = 100;
const kTimeUntilSleep = 3000;
const kRangeResetTrigger = 1000;

const kPrintOut = 0;
const kPrintInterval = 100;


//-------------------------------------------------------------------------------------------
// state
//-------------------------------------------------------------------------------------------
export class FishDriver {
    static kWaiting = 0;
    static kTalking = 1;
    static kPausing = 2;
    static kFinishing = 3;
    static kGoingToSleep = 4;
    static kYammering = 20;
    mouthPos = 0;
    headPos = 0;
    tailPos = 0;
    talkStartTime = 0;

    state = FishDriver.kWaiting;
    noiseCount = 0;
    silenceCount = 0;
    globalCount = 0;
    lastHeardNoise = false;
    lastHeardSilence = false;
    timeOfLastStateChange = 0;

    // the loop routine runs over and over again forever:
    minV = 10000;
    maxV = 0;
    rangeCount = 0;

    board: Board;
    mouth: Motor;
    body: Motor;
    soundIn: Sensor;
    lastRun:[number,number][] = [];

    //-------------------------------------------------------------------------------------------
    // mouth control
    //-------------------------------------------------------------------------------------------

    openMouth() {
        if (this.mouthPos == 1) return;
        this.mouthPos = 1;
        this.mouth.reverse(255);
        //TODO is 255 the right number?
    }

    closeMouth() {
        if (this.mouthPos == 0) return;
        this.mouthPos = 0;
        //TODO is 255 the right number?
        this.mouth.forward(255);
    }

    targetMouthTime:number = 0;
    moveMouth() {
        let time: number = new Date().getTime() - this.talkStartTime;
        let jawPos = time / kJawTime;
        if (jawPos % 2 == 0) {
            this.openMouth();
        } else {
            let partial = (time % kJawTime) * 10 / kJawTime;
            if (partial > 5) this.closeMouth();
            else this.openMouth();
        }
    }

    //-------------------------------------------------------------------------------------------
    // head/tail control
    //-------------------------------------------------------------------------------------------

    setHead(up: number) {
        if (this.headPos == up) return;
        this.headPos = up;
        //TODO
        // if (this.headPos) this.body.reverse(255);
        // else this.body.forward(255);
    }
    yammer() {
        this.state = FishDriver.kYammering;
    }
    stop() {
        this.state = FishDriver.kGoingToSleep;
        this.setHead(0);
        this.closeMouth();
        this.goToSleep();
    }
    goToSleep() {
        this.mouth.forward(0);
        this.mouth.stop();
        //TODO
        //this.body.stop();
    }

    updateMotorsFromAudio(audioSensorValue: number) {
        let timeSinceLastStateChange = (new Date()).getTime() - this.timeOfLastStateChange;
        let lastState = this.state;
        // increment the loop count
        this.globalCount++;

        // update min/max sensor values for diagnostics
        this.rangeCount++;
        if (this.rangeCount > kRangeResetTrigger) {
            this.minV = 10000;
            this.maxV = 0;
            this.rangeCount = 0;
        }
        this.minV = Math.min(audioSensorValue, this.minV);
        this.maxV = Math.max(audioSensorValue, this.maxV);

        // check to see if the audio sensor is above the noise threshold
        let hearNoise = audioSensorValue > kNoiseThreshold;
        if (this.lastHeardNoise == hearNoise) {
            this.noiseCount++;
        } else {
            this.noiseCount = 1;
            this.lastHeardNoise = hearNoise;
        }

        // check to see if the audio sensor is below the silence threshold
        let hearSilence = audioSensorValue <= kSilenceThreshold;
        if (this.lastHeardSilence == hearSilence) {
            this.silenceCount++;
        } else {
            this.silenceCount = 1;
            this.lastHeardSilence = hearSilence;
        }

        // check to see if the audio sensor is above the reactivation threshold
        let reactivateSound = audioSensorValue > kReactivateThreshold;

        // now update state.
        switch (this.state) {
            case FishDriver.kWaiting:
                if (hearNoise) {
                    this.talkStartTime = new Date().getTime();
                    this.state = FishDriver.kTalking;
                    this.lastRun = [[this.state,audioSensorValue]];
                }
                break;
            case FishDriver.kTalking:
                // TODO change from count to timer, add timer callback
                if (hearSilence) {
                    this.state = FishDriver.kPausing;
                }
                break;
            case FishDriver.kPausing:
                if (hearSilence == false){
                    this.state = FishDriver.kTalking;
                }
                else if (timeSinceLastStateChange > kTimeUntilFinishing) {
                    this.state = FishDriver.kFinishing;
                }
                break;        
            case FishDriver.kFinishing:
                if (reactivateSound) {
                    this.state = FishDriver.kTalking;
                    // TODO change from count to timer, add timer callback
                } else if (hearNoise == false && timeSinceLastStateChange > kTimeUntilSleep) {
                    this.state = FishDriver.kGoingToSleep;
                } else {
//                    console.log(`${hearNoise}:${audioSensorValue}:${timeSinceLastStateChange}`);
                }
                break;
            case FishDriver.kGoingToSleep:
                this.state = FishDriver.kWaiting;
                break;
        }

        if(this.state != FishDriver.kWaiting) {
            this.lastRun.push([this.state,audioSensorValue]);
        }

        if (kPrintOut && this.globalCount % kPrintInterval == 0) {
            console.log(
                `s:(${this.state}) v:${audioSensorValue} | noise:${hearNoise}, ${this.noiseCount} | silence:${hearNoise}, ${this.silenceCount} | range:(${this.minV} - ${this.maxV}) - ${this.rangeCount}`
            );
        }

        // take action based on current state.
        switch (this.state) {
            case FishDriver.kWaiting:
                break;
            case FishDriver.kTalking:
            case FishDriver.kPausing:
            case FishDriver.kYammering:
                this.setHead(1);
                this.moveMouth();
                break;
            case FishDriver.kFinishing:
                this.setHead(1);
                this.closeMouth();
                break;
            case FishDriver.kGoingToSleep:
                this.setHead(0);
                this.closeMouth();
                this.goToSleep();
                break;
        }
        if(this.state != lastState) {
            this.timeOfLastStateChange = (new Date()).getTime();
            console.log(`${lastState} -> ${this.state}`);
        }
        return this.state;
    }

    //-------------------------------------------------------------------------------------------
    // startup
    //-------------------------------------------------------------------------------------------

    update(soundValue: number) {
        return this.updateMotorsFromAudio(soundValue);
    }
    constructor(board: Board) {
        this.mouth = new Motor(["GPIO13","GPIO5","GPIO6"] as any);
//TODO        this.body = new Motor(["a8", "a7", "a6"] as any);

        this.mouth.forward(0);
        this.mouth.stop();

        //TODO
        // this.body.forward(0);
        // this.body.stop();
    }

}