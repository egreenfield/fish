import { AWSSession } from "./AWSSession";
import { SQS, Response, AWSError } from "aws-sdk";

export class Listener {
    queuePromise: Promise<void>;
    sqs : SQS;
    queueUrl:string;
	constructor(public session:AWSSession) {
		this.sqs = new session.sdk.SQS({	
			region: "us-west-2"
        })
        this.queuePromise = this.sqs.getQueueUrl({QueueName:"fishTalk"}).promise().then(
            (v) => {this.queueUrl = v.QueueUrl;this.queuePromise = null;}
        );

	}
    async listen() {
        if (this.queuePromise) {
            await this.queuePromise;
        }
        let result = await this.sqs.receiveMessage({
//            WaitTimeSeconds:3,
            QueueUrl:this.queueUrl
        }).promise();
        
        let messages: SQS.Message[] = result.Messages || [];

        if(messages.length) 
            await this.sqs.deleteMessageBatch( 
                {
                    QueueUrl: this.queueUrl, 
                    Entries: messages.map((m,i) => {return {Id:""+i,ReceiptHandle:m.ReceiptHandle}})
                }).promise();
        return messages.map(v => v.Body);
    }
}
