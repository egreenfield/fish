export interface TransformerOptions {
	volume:number;
	speed:number;
};

export interface Transformer {
	init(options:TransformerOptions):void;
	transform(options:{input:string,output:string}):Promise<void>;
}

