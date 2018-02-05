import * as five from "johnny-five";
import { Board, Sensor } from "johnny-five";
let five_:any = five;


const kVoltageLimit = 2000;

export class Speaker {
    public value = 0;
    private sensor:Sensor;

    constructor(board:Board) {
        let virtual = new five_.Board.Virtual(
            new five_.Expander("ADS1115")
          );        
        // Initialize a Sensor instance with
        // the virtual board created above
        this.sensor = new five.Sensor({
            pin: 0,
            board: virtual
        } as any);
        this.sensor.on("change", () => {
            let v = this.sensor.value;
            if(v > kVoltageLimit)
                return;
            this.value = v;
        });
    }
}