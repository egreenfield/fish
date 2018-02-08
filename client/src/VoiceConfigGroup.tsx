
import * as React from 'react';
import { VoiceConfig } from './FishModel';
import { Subscription } from 'rxjs';
import { ComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { OptionSlider } from "./OptionSlider";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Button } from 'office-ui-fabric-react/lib/Button';

const kTestUrl = "/api/postMessage";

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
    sampleText:string;
}

    


export class VoiceConfigGroup extends React.Component<VoiceConfigGroupProps,VoiceConfigGroupState> {
  
    configSub:Subscription;

    componentWillMount() {
        this.setState({ sampleText: ""});
    }


    componentWillUnmount() {
    }
  
  private handleChange(field:string,value:string) {
    let newVoiceConfig:VoiceConfig = {...this.props.model, [field]:value};
        
    this.props.onChanged(newVoiceConfig);
  }

  private async  runTest() {
    let sampleText = this.state.sampleText;
    if (sampleText == undefined || sampleText.length == 0)
        sampleText = "The fish says Bubble Bubble";
    return await fetch(kTestUrl,{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({text:sampleText})
    });
  }

  public render() {
    //let { config: { listening } } = this.state
    let { name, speed, pitch, volume} = this.props.model;

    let { sampleText } = this.state;
    return (
        <div className="voiceConfigPanel">
            <ComboBox label="Voice Profile" value={name}  options={optionData.voices.map(v => ({key:v,text:v}))} onChanged={(v)=>this.handleChange("name",v!.text)}/>
            <OptionSlider label="volume" options={optionData.volumes} onChanged={v=>this.handleChange("volume",v)} value={volume} />
            <OptionSlider label="rate" options={optionData.rates} onChanged={v=>this.handleChange("speed",v)} value={speed} />
            <OptionSlider label="pitch" options={optionData.pitches} onChanged={v=>this.handleChange("pitch",v)} value={pitch} />
            <TextField label="sample text" placeholder="The fish says Bubble Bubble" value={sampleText} onChanged={v => this.setState({sampleText: v})} />
            <Button text="Test" onClick={()=>this.runTest()} />
        </div>
    );
  } 
}