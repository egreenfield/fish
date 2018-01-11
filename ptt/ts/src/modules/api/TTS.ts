
export interface TTS {
    init():void;
	fetchAudio(options:{message:string;output:string}):Promise<void>;	
}
