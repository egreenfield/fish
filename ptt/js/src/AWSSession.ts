import * as AWS from 'aws-sdk';


export class AWSSession {
    public sdk:typeof AWS;
    constructor(profile:string = "personal") {
        let credentials = new AWS.SharedIniFileCredentials({profile});
        AWS.config.update({credentials});
        this.sdk = AWS;
    }
}