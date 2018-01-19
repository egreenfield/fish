import { Listener } from './Listener';
import { TTS } from './TTS';
import { Speaker } from './speaker';
import { Transformer } from './Transformer';

export class Tools {
    listener:Listener;
    fetcher:TTS;
    speaker:Speaker;
    transformer:Transformer;

    public init() {
        this.listener.init();
        this.fetcher.init();
        this.speaker.init();
        this.transformer.init();
    }
}
