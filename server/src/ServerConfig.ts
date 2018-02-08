

const kConfigPath = "config/server.json";
import { exists, readFile, writeFile } from "fs";
import { promisify } from "util";


const existsP = promisify(exists);
const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);

export interface VoiceConfig {
    name: string;
    speed: string;
    pitch: string;
    volume:string;
}
export interface VoiceRule {
    pattern:string;
    config:VoiceConfig;
}
export interface ServerConfig {
    listening:boolean;
    sleep:boolean;
    sleepTime:number;
    wakeTime:number;
    defaultVoice: VoiceConfig;
    voiceRules: VoiceRule[];
}

function createDefaultConfig():ServerConfig {
    return {
        listening: true,
        sleep: false,
        sleepTime: 0,
        wakeTime: 0,
        defaultVoice: {
            name: "Brian",
            speed: "x-slow",
            pitch: "medium",
            volume: "x-loud"
        },
        voiceRules: []
    }
}
export class ConfigMgr {
    
    public config:ServerConfig;

    async load() {
        if(await existsP(kConfigPath)) {              
            this.config = JSON.parse((await readFileP(kConfigPath)).toString());
        } else {
            await this.update(createDefaultConfig());            
        }
        return this.config;
    }
    async update(newConfig:ServerConfig) {
        this.config = newConfig;
        await writeFileP(kConfigPath,JSON.stringify(newConfig));
    }

}

