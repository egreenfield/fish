#!/usr/local/bin/node
import * as ffmpeg from 'fluent-ffmpeg';
import { Transformer, TransformerOptions } from '../api/Transformer';
import { Tools } from '../api/Tools';
import { logger } from "../../../logger";

const silenceFile = "../output/silence.ac3";

export class FFMpegTransformer implements Transformer {

	volume = 5;
	speed = 1.3;
	constructor(public tools:Tools) {
	}
	setTransform(options:TransformerOptions) {
		this.volume = options.volume || this.volume;
		this.speed = options.speed || this.speed;
	}
	init() {
	}

	async transform(options:{input:string,output:string,prefix:string,outputFolder:string}) {
		let tempFile = options.outputFolder + options.prefix + "temp.mp3";
		return new Promise<void>((resolve,reject) => {
			logger.info("processing...")
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
			.saveToFile(tempFile);
		}).then(() => {
			logger.info("adding silence...")
			return new Promise<void>((resolve,reject) => {
				var command = ffmpeg(silenceFile)
					.addInput(tempFile)
					.addInput(silenceFile)
					.on('end', (stdout, stderr) => {
						resolve();
					})
					.on('error', function(err, stdout, stderr) {
						reject(err);
					})
					.mergeToFile(options.output);			
									
			})
		})
	}
}

