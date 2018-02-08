
import * as React from 'react';
import { FishModel, FishConfig } from './FishModel';
import { Subscription } from 'rxjs';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';

interface GeneralPageProps {
  model:FishModel;
}

interface GeneralPageState {
    config:FishConfig;
}

    


export class GeneralPage extends React.Component<GeneralPageProps,GeneralPageState> {
  
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
  
  private updateConfig(prop:string,newValue:any) {
    let newConfig = {...this.state.config, [prop]: newValue};
    this.props.model.updateConfig(newConfig);
    this.setState({config:newConfig});
  }

  public render() {
    let { config: { listening } } = this.state;
    return (
        <div className="compactPanel">
            <Toggle
            label='Status'
            onText='Listening'
            offText='Sleeping'
            checked={listening}
            onChanged={(v)=>this.updateConfig("listening",v)}
            />       </div>
    );
  } 
}