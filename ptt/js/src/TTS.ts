import { AWSSession } from "./AWSSession";
import { Polly } from "aws-sdk";
import { writeFile } from "fs";
export class TTS {
	polly: Polly;

	constructor(public session:AWSSession) {
		this.polly = new session.sdk.Polly({	
			region: "us-west-2"
		})
	}
	fetchAudio(options:{message:string;output:string}):Promise<void> {
		console.log("saving message to",options.output);
		return this.polly.synthesizeSpeech({OutputFormat:"mp3",Text:options.message,VoiceId:"Brian"}).promise().then((data) => {
			console.log("response is ",data);
			return new Promise<void>((resolve,reject) => {
				writeFile(options.output,data.AudioStream,{},(err) => {
					if(err) return reject(err);
					console.log("output file written");
					resolve();		
				});	
			})
		});
	}
}
