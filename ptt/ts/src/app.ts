#!/usr/local/bin/node

import * as program from "commander";
import { Tools } from './listen/modules/api/Tools';
import { AWSSession } from "./listen/modules/impl/AWSSession";
import { SQSListener } from './listen/modules/impl/SQSListener';
import { PollyTTS } from './listen/modules/impl/PollyTTS';
import { OSXSpeaker } from './listen/modules/impl/OSXSpeaker';
import { FFMpegTransformer } from './listen/modules/impl/FFMpegTransformer';
import { ListenAndSay } from './listen/ListenAndSay';
import { RPISpeaker } from './listen/modules/impl/RPISpeaker';
import { CommandType } from "./listen/modules/api/Message";
import * as winston from "winston";
import { FishModule } from "./motion/FishModule";

winston.configure({
    // format: winston.format.combine(
    //     winston.format.splat(),
    //     winston.format.simple()
    //   ),
        transports: [
        //rotateTransport,
        //new winston.transports.File({filename: '../logs/listener.log'}),
        new winston.transports.File({
            colorize: false,
            timestamp: true,
            filename: '../logs/listener.log.json',
            maxsize: 100*1024,
            json: false,
            maxFiles: 5
        }),
        new winston.transports.Console({colorize:true,json:false})
    ]
})

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

let fishModule:any;

if(process.platform == "linux")
    fishModule = new FishModule();

program
.command('speak <message>')
.description('say a string')
.action((message:string,options:any) => {
    winston.info("speaking message");
    las.sayMessage({command:CommandType.speak, source:"<command line>", arguments:{text:message}});
});

program
.command('listen')
.description('listen to the cloud for messages')
.action((options:any) => {
    if(fishModule)
        fishModule.start({interactive:false});
    winston.info("starting standard listening mode");
    las.start();
});

program
.version('0.1.0')
.parse(process.argv);





