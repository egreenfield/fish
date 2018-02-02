import { exec } from "child_process";
import { promisify } from "util";
import { Tools } from "../api/Tools";
import { Speaker } from "../api/Speaker";
import { logger } from "../../../logger";

const execP = promisify(exec);

export class RPISpeaker implements Speaker {

	constructor(public tools:Tools) {
	}
	init() {		
	}
	
	async speak(mp3File:string) {
        logger.info("spawning player process",{file:mp3File});
        await execP("mpg321 -q -a alexa " + mp3File);        
	}
}
