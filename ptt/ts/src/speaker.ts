import { exec } from "child_process";
import { promisify } from "util";

const execP = promisify(exec);

export class Speaker {

	constructor() {
	}
	async speak(mp3File:string) {
        console.log("spawning player process for",mp3File);
        await execP("afplay " + mp3File);        
	}
}
