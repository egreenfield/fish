import { AWSSession } from "./AWSSession";
import { Polly } from "aws-sdk";
import { writeFile } from "fs";
import { promisify } from "util";
import { Tools } from "../Tools";

const writeFileP = promisify(writeFile);

export class PollyTTS {
	polly: Polly;

	constructor(public tools:Tools, public session:AWSSession) {
		this.polly = new session.sdk.Polly({	
			region: "us-west-2"
		})
	}
	init():void {}
	
	async fetchAudio(options:{message:string;output:string}) {
		console.log("saving message to",options.output);
		let data = await this.polly.synthesizeSpeech({OutputFormat:"mp3",Text:options.message,VoiceId:"Brian"}).promise()
		await writeFileP(options.output,data.AudioStream,{});
		console.log("output file written");
	}
}
