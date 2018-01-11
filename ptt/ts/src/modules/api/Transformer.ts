export interface Transformer {
	init():void;
	transform(options:{input:string,output:string}):Promise<void>;
}
