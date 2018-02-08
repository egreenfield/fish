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
import { logger } from "./logger";
import { FishModule } from "./motion/FishModule";
import { Server } from "./server/server"
import { ConfigMgr } from "./ServerConfig";



//---------------------------------------------------------------------------------------------------------------------------------------------------------------- 
// set up listener process
async function init() {
    let configMgr = new ConfigMgr();

    await configMgr.load();
    logger.info("config loaded",{config:configMgr.config});    

    let tools = new Tools();
    tools.configMgr = configMgr;

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

    let las = new ListenAndSay(tools,"output/","main_");


    //---------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    // set up motion process

    let fishModule:any;

    if(process.platform == "linux")
        fishModule = new FishModule();

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    // set up web server
    let server:Server = new Server(las,configMgr);
    server.init();

    //---------------------------------------------------------------------------------------------------------------------------------------------------------------- 
    // process command line
        
    program
    .command('speak <message>')
    .description('say a string')
    .action((message:string,options:any) => {
        logger.info("speaking message");
        las.sayMessage({command:CommandType.speak, source:"<command line>", arguments:{text:message}});
    });

    program
    .command('listen')
    .description('listen to the cloud for messages')
    .action((options:any) => {
        if(fishModule)
            fishModule.start({interactive:false});
        logger.info("starting standard listening mode");
        las.start();
    });

    program
    .version('0.1.0')
    .parse(process.argv);
}

init();

