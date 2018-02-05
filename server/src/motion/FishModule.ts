import * as five from "johnny-five";
import { Speaker } from "./Speaker";
import { FishDriver } from "./FishDriver";
import * as babar from "babar";
import * as cc from "cli-chart";

let raspi:any;
if(process.platform == "linux") {
  raspi = require( "raspi-io" );
}
//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
//TODO check sound in pin
const SoundInPin = "A0";
const kInterval = 2;
let five_: any = five;
let board: five.Board;
let led: any;

let report: boolean = false;
let autoreport: boolean = false;
let domain: { min: number; max: number } = { min: Infinity, max: -Infinity };
let speaker: Speaker;
let fishDriver: FishDriver;
let callbackCount = 0;
let lastCallbackTime: number = -1;
let callbackInterval = 0;

//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

let colors = ["green", "blue", "yellow", "red", "cyan"];
function chart(values: number[][], state: number, maxX: number) {
  let color = state < 0 ? "yellow" : colors[state];
  console.log(
    babar(
      values.filter(
        (v, i) => v[2] == state || state < 0 || i == 0 || i == values.length - 1
      ),
      { width: 480, height: 15, minX: 0, maxX: maxX, color: color }
    )
  );
}
function dump() {
  let sampleRate = callbackInterval / callbackCount;
  let newValues = fishDriver.lastRun.map((v, i) => [
    i * sampleRate / 1000,
    v[1],
    v[0]
  ]);
  let maxX = newValues[newValues.length - 1][0];
  // chart(newValues,FishDriver.kWaiting,maxX);
  // chart(newValues,FishDriver.kTalking,maxX);
  // chart(newValues,FishDriver.kPausing,maxX);
  // chart(newValues,FishDriver.kFinishing,maxX);
  // chart(newValues,FishDriver.kGoingToSleep,maxX);
  chart(newValues, -1, maxX);
  // console.log(babar(fishDriver.lastRun.map((v,i) => [i*sampleRate/1000,v[1]]),{width:160,height:30}));

  // let chart = new cc({
  //   width: 160,
  //   step: 1
  // })
  // fishDriver.lastRun.forEach(([state,value],i) => {
  //   chart.addBar(value,colors[state]);
  // });
  // chart.draw();

  // console.log(fishDriver.lastRun.map((v,i) => `(${Math.floor(i*sampleRate/1000*10)/10},${v[1]},${v[0]})`).join(""));
  console.log(`${sampleRate} ms/interval`);
}

export class FishModule {
  interactive:Boolean = false;

  constructor() {

  }

  private initRepl(board:five.Board) {
    board.repl.inject({
      s: () => {
        report = !report;
      },
      r: () => {
        domain = { min: Infinity, max: -Infinity };
      },
      stats: () => {
        return dump();
      },
      p: () => {
        fishDriver.stop();
      },
      autoreport: () => {
        autoreport = !autoreport;
      },
      y: () => {
        fishDriver.yammer();
      }
    });
  }

  private initBoard() {
    console.log("board ready");
    led = new five_.Led("GPIO25" as any);
    led.blink(500);

    if (this.interactive) {
      this.initRepl(board);
    }

    speaker = new Speaker(board);
    fishDriver = new FishDriver(board);
    setInterval(this.update.bind(this), kInterval);
  }

  private update() {
    let v = speaker.value;
    let t = new Date().getTime();
    if (lastCallbackTime > 0) {
      let delta = t - lastCallbackTime;
      callbackInterval += delta;
      callbackCount++;
    }
    lastCallbackTime = t;
    domain.min = Math.min(v, domain.min);
    domain.max = Math.max(v, domain.max);
    let s = fishDriver.state;
    let newState = fishDriver.update(v);
    if (report)
      console.log(`${v}: (${newState}:${domain.min}:${domain.max}`);
    if (autoreport && s != newState) {
      console.log(`${s} -> ${newState}`);
    }
    if (
      s == FishDriver.kGoingToSleep &&
      newState == FishDriver.kWaiting &&
      autoreport
    ) {
      dump();
    }
  }

  start(options:{ interactive: boolean }) {
    this.interactive = options.interactive;
    if(process.platform == "linux") {
      board = new five.Board({
        io: new raspi(),
        repl: this.interactive == true
      } as any);
    } else {
      board = new five.Board({
        repl: this.interactive == true
      } as any);      
    }

    board.on("ready", this.initBoard.bind(this));
    board.on("exit", () => {
      led.off();
    });
  }
}
