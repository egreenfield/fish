export enum CommandType {
    speak = "speak"
};

export interface Command {    
    command:CommandType;
    source:string;
    arguments:any;
}