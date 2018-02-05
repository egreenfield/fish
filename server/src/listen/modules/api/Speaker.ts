export interface Speaker {
    init():void;
    speak(mp3File:string):Promise<void>;
}
