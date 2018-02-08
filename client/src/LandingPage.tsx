
import * as React from 'react';
import { FishModel } from './FishModel';


interface LandingPageProps {
  model:FishModel;
}

export class LandingPage extends React.Component<LandingPageProps> {
  
    constructor(props: LandingPageProps) {
      super(props);


    }
  
  

  public render() {
    return (
          <img  src="assets/bass.png" />
    );
  }
}