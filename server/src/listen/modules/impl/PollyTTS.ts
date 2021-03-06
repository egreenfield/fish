import { AWSSession } from "./AWSSession";
import { Polly } from "aws-sdk";
import { writeFile } from "fs";
import { promisify } from "util";
import { Tools } from "../api/Tools";
import { logger } from "../../../logger";

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
		let {defaultVoice: {name,speed,pitch,volume}} = this.tools.configMgr.config;

		logger.info(`saving message to ${options.output}`);
		logger.info(`speaking with: ${JSON.stringify(this.tools.configMgr.config.defaultVoice)}`);
		let parts = options.message.split("&&");
		let msg = parts.shift();
		for(let i=0;i<parts.length;i++) {
			if(i % 2 == 0)
				msg += '<say-as interpret-as="expletive">';
			else
				msg += '</say-as>';
			msg += parts[i];
		}
		logger.info(`getting audio for message: '${msg}'`);
		let data = await this.polly.synthesizeSpeech({
			OutputFormat:"mp3",
			TextType:"ssml",
			Text:`<speak><break time="1s"/>
			<prosody rate="${speed}" volume="${volume}" pitch="${pitch}">
			${msg}
			</prosody>
			<break time="1s"/></speak>`,
			VoiceId:name}
		).promise();
		await writeFileP(options.output,data.AudioStream,{});
		logger.info("output file written");
	}
}
