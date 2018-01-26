import { AWSSession } from "./AWSSession";
import { Polly } from "aws-sdk";
import { writeFile } from "fs";
import { promisify } from "util";
import { Tools } from "../api/Tools";

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
		let data = await this.polly.synthesizeSpeech({
			OutputFormat:"mp3",
			TextType:"ssml",
			Text:`<speak><break time="1s"/>
			<prosody rate="x-slow" volume="+150dB">
			${options.message}
			</prosody>
			<break time="1s"/></speak>`,
			VoiceId:"Brian"}
		).promise();
		await writeFileP(options.output,data.AudioStream,{});
		console.log("output file written");
	}
}
