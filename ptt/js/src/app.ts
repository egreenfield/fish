#!/usr/local/bin/node
import { AWSSession } from "./AWSSession";
import { TTS } from "./TTS";
import { Transformer } from "./Transformer";
import { Listener } from "./LIstener";

let session = new AWSSession();
let fetcher = new TTS(session);
let xform = new Transformer();
let listener = new Listener(session);

const rawFile = "../output/rawTestOutput.mp3";
const xformedFile = "../output/xformedTestOutput.mp3";
function reportError(err:Error) {
	console.log("Error reported:",err.message);
}

async function sayMessage(message:string) {
	console.log("fetching speech");
	await fetcher.fetchAudio({message,output:rawFile});
	console.log("transforming audio");
	await xform.transform({input:rawFile,output:xformedFile});		
}


async function listenOnce() {
	let messages = await listener.listenOnce();
	for(let i=0;i<messages.length;i++) {
		console.log(`processing message ${messages[i]}`);
		await sayMessage(messages[i]);
	}
	return messages.length;
}
async function processMessages(err:Error,messages:string[]) {
	if(err) {
		throw err;
	}
	for(let i=0;i<messages.length;i++) {
		console.log(`****** processing message "${messages[i]}"`);
		await sayMessage(messages[i]);
		console.log("message processed");
	}
}

// listenOnce().then((len)=> {
// 	console.log(len,"messages processed")
// }).catch((reason) => {
// 	console.log("failed with",reason);
// })


//sayMessage("This is a test message from the other side");

listener.startListening(processMessages);