import * as five from "johnny-five";
import * as raspi from "raspi-io";
import { Speaker } from "./Speaker";
import { FishDriver } from "./FishDriver";
import * as babar from "babar";
import * as cc from "cli-chart";

//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
//TODO check sound in pin
const SoundInPin = "A0";

let five_:any = five;
let board: five.Board;
let led:any;

let report:boolean = false;

let domain:{min:number;max:number} = {min:Infinity,max:-Infinity};
let speaker:Speaker;
let fishDriver:FishDriver;
let callbackCount = 0;
let lastCallbackTime:number = -1;
let callbackInterval = 0;

//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

let colors = ['green','blue','yellow','red','cyan'];
function chart(values:number[][],state:number,maxX:number) {
  let color = (state < 0)? "yellow":colors[state];
  console.log(babar(values.filter((v,i) => (v[2] == state || state < 0 || i == 0 || i == values.length-1)),{width:480,height:15,minX:0,maxX:maxX,color:color}));
}
function dump() {
  let sampleRate = callbackInterval/callbackCount;
  let newValues = fishDriver.lastRun.map((v,i) => [i*sampleRate/1000,v[1],v[0]]);
  let maxX = newValues[newValues.length-1][0];
  // chart(newValues,FishDriver.kWaiting,maxX);
  // chart(newValues,FishDriver.kTalking,maxX);
  // chart(newValues,FishDriver.kPausing,maxX);
  // chart(newValues,FishDriver.kFinishing,maxX);
  // chart(newValues,FishDriver.kGoingToSleep,maxX);
  chart(newValues,-1,maxX);
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
// the setup routine runs once when you press reset:
function init() {
    board = new five.Board({
        io: new raspi()
    } as any);

    board.on("ready", () => {
        console.log("board ready");                
        led = new five_.Led("GPIO25" as any);
        led.blink(500);

        board.repl.inject({
            // Allow limited on/off control access to the
            // Led instance from the REPL.
            s: () => {
                report = !report;
            },
            reset: () => {
                domain = {min:Infinity,max:-Infinity}
            },
            stats: () => {
              return dump();
            },
            p: () => {
              fishDriver.stop();
            },
            y: () => {
              fishDriver.yammer();
            },
        });

    speaker = new Speaker(board);
    fishDriver = new FishDriver(board);
    setInterval(() => {
        let v = speaker.value;
        let t = (new Date()).getTime();
        if(lastCallbackTime > 0) {
          let delta = t - lastCallbackTime;
          callbackInterval += delta;
          callbackCount++;
        }
        lastCallbackTime = t;
        domain.min = Math.min(v,domain.min);
        domain.max = Math.max(v,domain.max);
        if(report)
            console.log(`${v}: (${domain.min}:${domain.max}`);
        let s = fishDriver.state;
        let newState = fishDriver.update(v);
        if(s == FishDriver.kGoingToSleep && newState == FishDriver.kWaiting) {
          dump();
        }
    },5);

    });
    board.on("exit",() => {
        led.off();
    });
  }

  
init();