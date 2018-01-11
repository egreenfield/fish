import { Tools } from './../Tools';
import { Listener } from "./LIstener";
import { AWSSession } from "./AWSSession";
import { SQS, Response, AWSError } from "aws-sdk";
import { setTimeout } from "timers";

export class SQSListener implements Listener {
    private queuePromise: Promise<void>;
    private sqs : SQS;
    private queueUrl:string;
    private callback:(err:Error,messages:string[])=>Promise<void>;
    private listening = false;

	constructor(public tools:Tools,public session:AWSSession) {
        this.sqs = new session.sdk.SQS({	
			region: "us-west=mn  -2"
        })
        this.queuePromise = this.sqs.getQueueUrl({QueueName:"fishTalk"}).promise().then(
            (v) => {this.queueUrl = v.QueueUrl;this.queuePromise = null;}
        );
    }

    public init() {
	
	}

    private async retrieveMessageFromQueue() {
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
    
    private async checkForMessages() {
        let messages = await this.retrieveMessageFromQueue();
        if(this.callback) 
            await this.callback(null,messages);
        return messages;
    }

    private setNextTimeout() {
        if(this.listening) {
            setTimeout(() => {
                this.checkForMessages();
                this.setNextTimeout();
            },1);
        }
    }
    public startListening(callback:(err:Error,messages:string[])=>Promise<void>) {
        if(this.listening)
            return;
        this.listening = true;
        this.callback = callback;
        this.setNextTimeout();
    }
    
    public stopListening() {
        this.listening = false;
    }
    async listenOnce() {
        let messages = await this.checkForMessages();
        return messages;        
    }
}
