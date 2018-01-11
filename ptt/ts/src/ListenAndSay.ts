import { Tools } from "./modules/api/Tools";

export class ListenAndSay {
    private rawFilePath:string;
    private transformedFilePath:string;

    constructor(public tools:Tools,private outputFolder:string,filePrefix:string = "") {
        this.rawFilePath = outputFolder+filePrefix+"rawFile.mp3";
        this.transformedFilePath = outputFolder+filePrefix+"transformedFile.mp3";
    }
    reportError(err:Error) {
        console.log("Error reported:",err.message);
    }
    
    async sayMessage(message:string) {
        console.log("fetching speech");
        await this.tools.fetcher.fetchAudio({message,output:this.rawFilePath});
        console.log("transforming audio");
        await this.tools.transformer.transform({input:this.rawFilePath,output:this.transformedFilePath});		
        await this.tools.speaker.speak(this.transformedFilePath);
    }

    async listenOnce() {
        let messages = await this.tools.listener.listenOnce();
        for(let i=0;i<messages.length;i++) {
            console.log(`processing message ${messages[i]}`);
            await this.sayMessage(messages[i]);
        }
        return messages.length;
    }
    
    async processMessages(err:Error,messages:string[]) {        
        if(err) {
            this.reportError(err);
        }
        for(let i=0;i<messages.length;i++) {
            console.log(`****** processing message "${messages[i]}"`);
            await this.sayMessage(messages[i]);
            console.log("message processed");
        }
    }
    public start() {
        this.tools.listener.startListening(this.processMessages.bind(this));        
    }
}