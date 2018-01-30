import * as five from "johnny-five";
import * as raspi from "raspi-io";
import { Speaker } from "./Speaker";
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
let limit = 3000;
let speaker:Speaker;
//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

// the setup routine runs once when you press reset:
function init() {
    board = new five.Board({
        io: new raspi()
    } as any);

    board.on("ready", () => {
        console.log("board ready");
        let virtual = new five_.Board.Virtual(
            new five_.Expander("ADS1115")
          );
                
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
        }
    });

    speaker = new Speaker(board);
    setInterval(() => {
        let v = speaker.value;
        domain.min = Math.min(v,domain.min);
        domain.max = Math.max(v,domain.max);
        if(report)
            console.log(`${v}: (${domain.min}:${domain.max}`);
    },10);

    });
    board.on("exit",() => {
        led.off();
    });
  }

  
init();