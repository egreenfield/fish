export enum CommandType {
    speak = "speak"
};

export interface Command {    
    command:CommandType;
    source:string;
    arguments:any;
}

export interface SpeakCommand extends Command {
    command: CommandType.speak;
    arguments: {
        text:string;        
    }
}