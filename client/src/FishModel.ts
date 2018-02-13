

import {  Observable } from "rxjs";
import { Subject } from "rxjs/Subject";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


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
export interface FishConfig {
    listening:boolean;
    sleep:boolean;
    sleepTime:number;
    wakeTime:number;
    defaultVoice: VoiceConfig;
    users:User[];
}

export interface AuditRecord {
    sender:string;
    message:string;
    timestamp:Date;
}
export enum ActiveState {
    never,
    always,
    present
}
export interface User {
    name:string;
    device:string;
    active:ActiveState;
    queue:string;
}

function createDefaultConfig():FishConfig {
    return {
        listening: true,
        sleep: false,
        sleepTime: 0,
        wakeTime: 0,
        defaultVoice: {
            name: "Brian",
            speed: "medium",
            pitch: "medium",
            volume: "medium"
        },
        users:[]
    }
}

const kAuditUrl = "/api/messages";
const kConfigUrl = "/api/config";

export class FishModel {
    
    public auditRecord$= new BehaviorSubject([] as AuditRecord[]);
    private auditTrigger$ = new Subject();

    public config$ = new BehaviorSubject(createDefaultConfig());
    private configTrigger$ = new Subject();
    private localConfig$ = new Subject<FishConfig>();

    constructor() {

        this.auditTrigger$.switchMap(base => Observable.fromPromise(fetch(kAuditUrl)))
        .switchMap(r => Observable.fromPromise(r.json()))
        .map(v => (v as AuditRecord[]))
        .subscribe(this.auditRecord$);

        this.configTrigger$.switchMap(base => Observable.fromPromise(fetch(kConfigUrl)))
        .switchMap(r => Observable.fromPromise(r.json()))
        .map(v => v as FishConfig)
        .merge(this.localConfig$)
        .subscribe(this.config$);    
    }

    loadAudit(base:number = 0) {
        this.auditTrigger$.next(base);
    }

    loadConfig() {
        this.configTrigger$.next();
    }
    async updateConfig(c:FishConfig) {
        this.localConfig$.next(c);
        return await fetch(kConfigUrl,{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(c)
        });
    }
}