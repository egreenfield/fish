
import * as React from 'react';
import { FishModel, FishConfig, VoiceConfig } from './FishModel';
import { Subscription } from 'rxjs';
import { VoiceConfigGroup } from "./VoiceConfigGroup"; 

interface VoiceConfigPageProps {
  model:FishModel;
}

interface VoiceConfigPageState {
    config:FishConfig;
}

    


export class VoiceConfigPage extends React.Component<VoiceConfigPageProps,VoiceConfigPageState> {
  
    configSub:Subscription;

    componentWillMount() {
       this.configSub = this.props.model.config$.subscribe(v => {
        this.setState({config:v})
      },
      e => {
        console.log("error:",e.message);
      });

      this.props.model.loadConfig();
    }
    

    componentWillUnmount() {
    this.configSub.unsubscribe();
    }
  
  private updateDefaultVoice(newValue:VoiceConfig) {
    let newConfig = {...this.state.config, defaultVoice: newValue};
    this.props.model.updateConfig(newConfig);
    this.setState({config:newConfig});
  }

  public render() {
    let { config: { defaultVoice } } = this.state;
    return (
        <div>
            <VoiceConfigGroup model={defaultVoice} onChanged={(v)=>this.updateDefaultVoice(v)} />
        </div>
    );
  } 
}