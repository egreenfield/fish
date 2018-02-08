
import * as React from 'react';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
 

interface OptionSliderProps {
  options:string[];
  onChanged:(value:string)=>void;
  label?:string;
  value:string;
}

    


export class OptionSlider extends React.Component<OptionSliderProps> {
  
  
  public render() {
    //let { config: { listening } } = this.state
    let { options, onChanged, label,value} = this.props;

    return (
        <Slider label={label} value={options.findIndex(v=> v == value)} showValue={false} min={0} max={options.length-1}  onChange={(v)=> onChanged && onChanged(options[v])} />
    );
  } 
}