import { AWSSession } from "./AWSSession";
import { SQS, Response, AWSError } from "aws-sdk";
import { setTimeout } from "timers";

export class Listener {
    queuePromise: Promise<void>;
    sqs : SQS;
    queueUrl:string;
    callback:(err:Error,messages:string[])=>Promise<void>;
    listening = false;
	constructor(public session:AWSSession) {
		this.sqs = new session.sdk.SQS({	
			region: "us-west-2"
        })
        this.queuePromise = this.sqs.getQueueUrl({QueueName:"fishTalk"}).promise().then(
            (v) => {this.queueUrl = v.QueueUrl;this.queuePromise = null;}
        );

	}
    async listenOnce() {
        if (this.queuePromise) {
            await this.queuePromise;
        }
        let result = await this.sqs.receiveMessage({
//            WaitTimeSeconds:3,
            QueueUrl:this.queueUrl
        }).promise();
    
        if(this.listening == false) {
            return;
        }

        let messages: SQS.Message[] = result.Messages || [];
        if(messages.length) 
            await this.sqs.deleteMessageBatch( 
                {
                    QueueUrl: this.queueUrl, 
                    Entries: messages.map((m,i) => {return {Id:""+i,ReceiptHandle:m.ReceiptHandle}})
                }).promise();
        return messages.map(v => v.Body);
    }
    
    async checkForMessages() {
        let messages = await this.listenOnce();
        await this.callback(null,messages);
        this.setNextTimeout();
    }
    setNextTimeout() {
        if(this.listening) {
            setTimeout(() => {
                this.checkForMessages();
            },1);
        }
    }
    startListening(callback:(err:Error,messages:string[])=>Promise<void>) {
        if(this.listening)
            return;
        this.listening = true;
        this.callback = callback;
        this.setNextTimeout();
    }
    
    stopListening() {
        this.listening = false;
    }
}