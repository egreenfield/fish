import { Tools } from "./modules/api/Tools";
import { Command } from "./modules/api/Message";
import * as winston from "winston";


export class ListenAndSay {
    private rawFilePath:string;
    private transformedFilePath:string;
    public transformOnClient = false;
    constructor(public tools:Tools,private outputFolder:string,private filePrefix:string = "") {
        this.rawFilePath = outputFolder+filePrefix+"rawFile.mp3";
        this.transformedFilePath = outputFolder+filePrefix+"transformedFile.mp3";
    }
    reportError(err:Error) {
        winston.info("Error reported:",err.message);
    }
    
    async sayMessage(message:Command) {
        winston.info("fetching speech");
        await this.tools.fetcher.fetchAudio({message: message.arguments.text,output:this.rawFilePath});
        if (this.transformOnClient) {
            winston.info("transforming audio");
            await this.tools.transformer.transform({input:this.rawFilePath,outputFolder:this.outputFolder,output:this.transformedFilePath,prefix:this.filePrefix});		
            await this.tools.speaker.speak(this.transformedFilePath);
        } else {
            await this.tools.speaker.speak(this.rawFilePath);            
        }
    }

    async listenOnce() {
        let messages = await this.tools.listener.listenOnce();
        for(let i=0;i<messages.length;i++) {
            winston.info("received message",{message:messages[i]});
            await this.sayMessage(messages[i].arguments.text);
        }
        return messages.length;
    }
    
    async processMessages(err:Error,messages:Command[]) {        
        if(err) {
            this.reportError(err);
        }
        try {
            for(let i=0;i<messages.length;i++) {
                winston.info("received message",{message:messages[i]});
                await this.sayMessage(messages[i]);
                //console.log("message processed");
            }
        } catch(e) {
            this.reportError(e as Error);
        }
    }
    public start() {
        this.tools.listener.startListening(this.processMessages.bind(this));        
    }
}