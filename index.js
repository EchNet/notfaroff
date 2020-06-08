import * as React from "react"
import { render } from "react-dom"
import * as Tone from "tone"
import { PlayNoteButton } from "./components";
import "./components.css";

var synth = new Tone.Synth({
    /***
    oscillator: {
    type: 'fmsquare',
    modulationType: 'sawtooth',
    modulationIndex: 3,
    harmonicity: 3.4
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0.1,
    release: 0.1
  }
  ****/
}).toMaster()

const App:React.SFC = () => <div><p>Here is some text in the React app.</p>
  <PlayNoteButton synth={synth} note="B2"/>
  <PlayNoteButton synth={synth}>C</PlayNoteButton>
  <PlayNoteButton synth={synth} note="D3"/>
  <PlayNoteButton synth={synth} note="E3"/>
  <PlayNoteButton synth={synth} note="F3"/>
</div>;

render(<App/>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept()
}
