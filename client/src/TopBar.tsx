
import * as React from 'react';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { FishModel, FishConfig } from './FishModel';
import { Subscription } from 'rxjs';

interface TopBarProps {
  model:FishModel;
}

interface TopBarState {
    config:FishConfig;
}
export class TopBar extends React.Component<TopBarProps,TopBarState> {
  
    configSub:Subscription;

    componentWillMount() {
       this.configSub = this.props.model.config$.subscribe(v => {
        this.setState({config:v})
      },
      e => {
        console.log("error:",e.message);
      });

    }

    componentWillUnmount() {
    this.configSub.unsubscribe();
    }
  
  

  public render() {
    //let { config: { listening } } = this.state
    let items = [
        {
            key: 'upload',
            name: 'Upload',
            icon: 'Upload',
            ['data-automation-id']: 'uploadButton'
          },
    ];

    return (
        <CommandBar items={items} />
    );
  }
}