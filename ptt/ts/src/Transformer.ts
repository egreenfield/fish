#!/usr/local/bin/node
import * as ffmpeg from 'fluent-ffmpeg';

export class Transformer {

	constructor() {
	}
	async transform(options:{input:string,output:string}) {
		console.log("processing...")
		var command = ffmpeg(options.input);
		command
		.audioFilters('volume=5')
		.audioFilters('atempo=1.3')
		.saveToFile(options.output);
	}
}

