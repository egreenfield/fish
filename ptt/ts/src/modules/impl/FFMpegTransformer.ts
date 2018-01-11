#!/usr/local/bin/node
import * as ffmpeg from 'fluent-ffmpeg';
import { Transformer } from './Transformer';
import { Tools } from './api/Tools';


export class FFMpegTransformer implements Transformer {

	constructor(public tools:Tools) {
	}
	init() {}

	async transform(options:{input:string,output:string}) {
		console.log("processing...")
		var command = ffmpeg(options.input);
		command
		.audioFilters('volume=5')
		.audioFilters('atempo=1.3')
		.saveToFile(options.output);
	}
}

