#!/usr/local/bin/node

import { Tools } from './modules/api/Tools';
import { AWSSession } from "./modules/impl/AWSSession";
import { Command } from "commander";
import { SQSListener } from './modules/impl/SQSListener';
import { PollyTTS } from './modules/impl/PollyTTS';
import { OSXSpeaker } from './modules/impl/OSXSpeaker';
import { FFMpegTransformer } from './modules/impl/FFMpegTransformer';
import { ListenAndSay } from './ListenAndSay';

let tools = new Tools();

let session = new AWSSession();
tools.listener = new SQSListener(tools,session);
tools.fetcher = new PollyTTS(tools,session);
tools.transformer = new FFMpegTransformer(tools);
tools.speaker = new OSXSpeaker(tools);

tools.init();

let las = new ListenAndSay(tools,"../output/","main_");

las.start();
