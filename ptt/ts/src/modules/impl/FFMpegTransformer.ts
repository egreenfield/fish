#!/usr/local/bin/node
import * as ffmpeg from 'fluent-ffmpeg';
import { Transformer, TransformerOptions } from '../api/Transformer';
import { Tools } from '../api/Tools';


export class FFMpegTransformer implements Transformer {

	volume = 5;
	speed = 1.3;
	constructor(public tools:Tools) {
	}
	init(options:TransformerOptions) {
		this.volume = options.volume || this.volume;
		this.speed = options.speed || this.speed;
	}

	async transform(options:{input:string,output:string}) {
		return new Promise<void>((resolve,reject) => {
			console.log("processing...")
			var command = ffmpeg(options.input);
			command
			.audioFilters(`volume=${this.volume}`)
			.audioFilters(`atempo=${this.speed}`)
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

