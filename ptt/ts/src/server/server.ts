import * as express from "express";
import { Request, Response} from "express";
import * as bodyParser from "body-parser";
import { logger } from "../logger";
import { ListenAndSay } from "../listen/ListenAndSay";
import { SpeakCommand, CommandType } from "../listen/modules/api/Message";

export class Server {
    app:express.Express;
    constructor(private listener:ListenAndSay) {

    }

    getMessages(req:Request,res:Response) {
        logger.query({
            limit:100,
            start:0,
            fields: ["message","sender"]
        },(err:any,results:any) => {

            res.send(JSON.stringify(results.file));
        })
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
        this.app.listen(8080,() => logger.info("WebServer started on port 8080"));
    }
}
