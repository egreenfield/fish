import * as express from "express";
import { promisify } from "util";
import { exec } from "child_process";
import { Request, Response} from "express";
import * as bodyParser from "body-parser";
import { logger, auditLog } from "../logger";
import { ListenAndSay } from "../listen/ListenAndSay";
import { SpeakCommand, CommandType } from "../listen/modules/api/Message";

const execP = promisify(exec);

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export class Server {
    app:express.Express;
    constructor(private listener:ListenAndSay) {

    }

    async getMessages(req:Request,res:Response) {
        auditLog.query({
            limit:50,
            start:0,
            fields: ["source","command","arguments"]
        },(err:any,results:any) => {

            let messages:any[] = results.file.filter((l:any) => l.command == "speak").map((l:any) => {return {source:l.source,text:l.arguments.text}});
//            let body = messages.map(v => JSON.stringify(v)).join("<br>");
//            res.send(body);
            res.send(JSON.stringify(messages));
        })
    }

    
    async resetBluetooth(req:Request,res:Response) {
        logger.info("resetting bluetooth");        
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Transfer-Encoding': 'chunked'
        });
        res.write("Resetting Bluetooth<br>");
        res.write("Disconnecting...<br>");
        await execP(`echo "disconnect FC:65:DE:0B:E3:2C" | /usr/bin/bluetoothctl`);        
        res.write("Waiting 5 seconds...<br>");
        await sleep(5000);
        res.write("reconnecting...<br>");
        await execP(`echo "connect FC:65:DE:0B:E3:2C" | /usr/bin/bluetoothctl`);        
        res.write("Bluetooth reset");
        res.end();

    }

    async postMessage(req:Request,res:Response) {
        logger.info(`received postMessage request from web`,{body: req.body});
        let command:SpeakCommand = {
            command: CommandType.speak,
            source: "web",
            arguments: {
                text: req.body.text
            }
        }
        await this.listener.sayMessage(command);
        res.send("message sent");
    }

    init() {
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended:true}));

        this.app.get('/api/messages',this.getMessages.bind(this));
        this.app.post('/api/postMessage',this.postMessage.bind(this));
        this.app.get('/api/resetBluetooth',this.resetBluetooth.bind(this));
        
        this.app.listen(8080,() => logger.info("WebServer started on port 8080"));
    }
}
