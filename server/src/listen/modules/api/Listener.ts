import { Command } from "./Message";
export interface Listener {
    init():void;
    startListening(callback:(err:Error,commands:Command[])=>Promise<void>):void;
    stopListening():void;
    listenOnce():Promise<Command[]>;
}
