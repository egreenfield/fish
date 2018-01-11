
export interface Listener {
    init():void;
    startListening(callback:(err:Error,messages:string[])=>Promise<void>):void;
    stopListening():void;
    listenOnce():Promise<string[]>;
}
