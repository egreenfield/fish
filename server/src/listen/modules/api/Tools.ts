import { Listener } from './Listener';
import { TTS } from './TTS';
import { Speaker } from './Speaker';
import { Transformer } from './Transformer';
import { ConfigMgr } from '../../../ServerConfig';

export class Tools {
    listener:Listener;
    fetcher:TTS;
    speaker:Speaker;
    transformer:Transformer;
    configMgr:ConfigMgr;

    public init() {
        this.listener.init();
        this.fetcher.init();
        this.speaker.init();
        this.transformer.init();
    }
}

