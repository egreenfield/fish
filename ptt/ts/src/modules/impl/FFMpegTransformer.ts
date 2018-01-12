#!/usr/local/bin/node
import * as ffmpeg from 'fluent-ffmpeg';
import { Transformer } from '../api/Transformer';
import { Tools } from '../api/Tools';


export class FFMpegTransformer implements Transformer {

	constructor(public tools:Tools) {
	}
	init() {}

	async transform(options:{input:string,output:string}) {
		return new Promise<void>((resolve,reject) => {
			console.log("processing...")
			var command = ffmpeg(options.input);
			command
			.audioFilters('volume=5')
			.audioFilters('atempo=1.3')
			.on('end', (stdout, stderr) => {
				resolve();
			})
			.on('error', function(err, stdout, stderr) {
				reject(err);
			})
			.saveToFile(options.output);
		});
	}
}

