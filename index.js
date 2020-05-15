import * as React from "react"
import { render } from "react-dom"
import * as Tone from "tone"

var synth = new Tone.Synth({
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
}).toMaster()

var playNotes = () => {
  synth.triggerAttackRelease('C4', 0.5, 0)
  synth.triggerAttackRelease('E4', 0.5, 1)
  synth.triggerAttackRelease('G4', 0.5, 2)
  synth.triggerAttackRelease('B4', 0.5, 3)
}

const App:React.SFC = () => <button type="button" onClick={playNotes}>Click me</button>;

render(<App/>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept()
}
