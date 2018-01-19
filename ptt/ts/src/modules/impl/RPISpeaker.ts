import { exec } from "child_process";
import { promisify } from "util";
import { Tools } from "../api/Tools";
import { Speaker } from "../api/Speaker";

const execP = promisify(exec);

export class RPISpeaker implements Speaker {

	constructor(public tools:Tools) {
	}
	init() {		
	}
	
	async speak(mp3File:string) {
        console.log("spawning player process for",mp3File);
        await execP("mpg321 -q -a alexa " + mp3File);        
	}
}
