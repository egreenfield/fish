
import * as React from 'react';
import { FishModel, FishConfig,  User } from './FishModel';
import { Subscription } from 'rxjs';
import { MasterDetail, Detail } from 'src/MasterDetail';

interface UserPageProps {
  model:FishModel;
}

interface UserPageState {
    config:FishConfig;
}

    
export class UserDetail extends Detail<User> {
}


export class UserPage extends React.Component<UserPageProps,UserPageState> {
  
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

  public render() {
    let { config: { users } } = this.state;
    return (
        <div>
            <MasterDetail items={users} getLabel={(u:User) => u.name} detailComponent={() => <UserDetail /> }  />
        </div>
    );
  } 
}