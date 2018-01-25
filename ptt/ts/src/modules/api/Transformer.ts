export interface TransformerOptions {
	volume:number;
	speed:number;
};

export interface Transformer {
	init():void;
	setTransform(options:TransformerOptions):void;
	transform(options:{input:string,output:string,prefix:string,outputFolder:string}):Promise<void>;
}

