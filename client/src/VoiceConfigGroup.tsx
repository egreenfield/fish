
import * as React from 'react';
import { VoiceConfig } from './FishModel';
import { Subscription } from 'rxjs';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
 

let optionData = {
    voices: [
        "Nicole",
        "Russell",
        "Amy",
        "Brian",
        "Emma",
        "Aditi",
        "Raveena",
        "Ivy",
        "Joanna",
        "Joey",
        "Justin",
        "Kendra",
        "Kimberly",
        "Matthew",
        "Salli",
        "Geraint"
    ],
    volumes: "x-soft,soft,medium,loud,x-loud".split(","),
    rates: "x-slow,slow,medium,fast,x-fast".split(","),
    pitches: "x-low,low,medium,high,x-high".split(",")
}
interface VoiceConfigGroupProps {
  model:VoiceConfig;
  onChanged:(model:VoiceConfig)=>void;
}

interface VoiceConfigGroupState {
}

    


export class VoiceConfigGroup extends React.Component<VoiceConfigGroupProps,VoiceConfigGroupState> {
  
    configSub:Subscription;

    componentWillMount() {
    }

    componentWillUnmount() {
    }
  
  private handleChange(field:string,value:string) {
    let newVoiceConfig:VoiceConfig = {...this.props.model, [field]:value};
        
    this.props.onChanged(newVoiceConfig);
  }
  public render() {
    //let { config: { listening } } = this.state
    let { name, speed, pitch, volume} = this.props.model;

    return (
        <div className="voiceConfigPanel">
            <ComboBox label="Voice Profile" value={name}  options={optionData.voices.map(v => ({key:v,text:v}))} onChanged={(v)=>this.handleChange("name",v!.text)}/>
            <ComboBox label="volume" value={volume}  options={optionData.volumes.map(v => ({key:v,text:v}))} onChanged={(v)=>this.handleChange("volume",v!.text)}/>
            <ComboBox label="rate" value={speed} options={optionData.rates.map(v => ({key:v,text:v}))} onChanged={(v)=>this.handleChange("speed",v!.text)}/>
            <ComboBox label="pitch" value={pitch}  options={optionData.pitches.map(v => ({key:v,text:v}))} onChanged={(v)=>this.handleChange("pitch",v!.text)}/>
        </div>
    );
  } 
}