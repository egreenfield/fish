
import * as React from 'react';
import './App.css';
import { NavPanel } from './NavPanel';
import { Route } from 'react-router-dom'
import { AuditTrail } from './AuditTrail';
import { VoiceConfigPage } from "./VoiceConfigPage";
import * as PropTypes from "prop-types";
import { FishModel } from './FishModel';
import { LandingPage } from './LandingPage';
import { TopBar } from "./TopBar";
import { GeneralPage } from './GeneralPage';
export interface AppContext {
  model:FishModel;
}

class App extends React.Component {
  model:FishModel = new FishModel();

  static childContextTypes = {
    model: PropTypes.object
  }

  getChildContext():AppContext {
    return {model: this.model};
  }


    
  public render() {
    return (
      <div className="app ms-fabric" >
        <div className="top">
          <TopBar model={this.model} />
        </div>
        <div className="bottom">
          <NavPanel />
          <div className="contentArea">
          <Route path="/" exact render={()=><LandingPage model={this.model}/>} />
          <Route path="/general" exact render={()=><GeneralPage model={this.model}/>} />
          <Route path="/audit" render={()=><AuditTrail model={this.model}/>} />
          <Route path="/voice" exact render={()=><VoiceConfigPage model={this.model}/>} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
