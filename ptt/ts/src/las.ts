#!/usr/local/bin/node

import * as program from "commander";
import { Tools } from './modules/api/Tools';
import { AWSSession } from "./modules/impl/AWSSession";
import { SQSListener } from './modules/impl/SQSListener';
import { PollyTTS } from './modules/impl/PollyTTS';
import { OSXSpeaker } from './modules/impl/OSXSpeaker';
import { FFMpegTransformer } from './modules/impl/FFMpegTransformer';
import { ListenAndSay } from './ListenAndSay';
import { RPISpeaker } from './modules/impl/RPISpeaker';

let tools = new Tools();

let session = new AWSSession();
tools.listener = new SQSListener(tools,session);
tools.fetcher = new PollyTTS(tools,session);
tools.transformer = new FFMpegTransformer(tools);
tools.transformer.setTransform({volume:4,speed:.8});
if (process.platform == "darwin") {
    tools.speaker = new OSXSpeaker(tools);
} else {
    tools.speaker = new RPISpeaker(tools);// new OSXSpeaker(tools);
}

tools.init();


let las = new ListenAndSay(tools,"../output/","main_");

program
.command('speak <message>')
.description('say a string')
.action((message:string,options:any) => {
    console.log(`saying message "${message}"`)
    las.sayMessage(message)
});

program
.command('listen')
.description('listen to the cloud for messages')
.action((options:any) => {
    console.log("starting standard listening mode")
    las.start();
});

program
.version('0.1.0')
.parse(process.argv);





