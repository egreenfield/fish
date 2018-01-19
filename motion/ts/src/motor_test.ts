import { Board, Motor, Sensor, Led } from "johnny-five";
import * as raspi from "raspi-io";
//-------------------------------------------------------------------------------------------
// constants
//-------------------------------------------------------------------------------------------
//TODO check sound in pin
const SoundInPin = "A0";

let board: Board;
let m1: Motor;
let m2: Motor;
let led:Led;



function goToSleep() {
    m1.stop();
    m2.stop();
}

//-------------------------------------------------------------------------------------------
// startup
//-------------------------------------------------------------------------------------------

// the setup routine runs once when you press reset:
function init() {
    board = new Board({
        io: new raspi()
    } as any);

    board.on("ready", () => {
        console.log("board ready");
    led = new Led("GPIO25" as any);
    led.on();

        // "blink" the led in 500ms on-off phase periods
            //TODO check motor pins.
  //head     m1 = new Motor(["GPIO13","GPIO5","GPIO6"] as any);
  m1 = new Motor(["GPIO12","GPIO17","GPIO27"] as any);
  //   body = new Motor(["a8", "a7", "a6"] as any);
  
    //TODO   AFMS.begin(64000);

    board.repl.inject({
        // Allow limited on/off control access to the
        // Led instance from the REPL.
        start: (v?:number) => {
        if( v === undefined)
            v = 255;
          if(v >= 0)
            m1.forward(v);
          else
            m1.reverse(-v);
          if(v == 0)
            m1.stop();
          led.blink(500);
        },
        stop: () => {
          //m1.stop();
          led.stop(0);
          led.on();
        }
      });

//      m1.start(255);
//     m1.stop();
  
    // m2.forward(0);
    // m2.stop();
    });
    board.on("exit",() => {
        m1.stop();
        led.off();
    });
  }

  
init();