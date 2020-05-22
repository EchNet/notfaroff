import * as React from "react"

export class PlayNoteButton extends React.Component {
  constructor(props) {
    super(props);
  }
  getNote() {
    return this.props.note || "C3";
  }
  playNote = () => {
    const synth = this.props.synth;
    const note = this.getNote();
    const duration = 0.5;
    synth.triggerAttackRelease(note, duration);
  }
  render () {
    const label = this.props.children || this.getNote();
    return <div className="hotbutt"><button onClick={this.playNote}>{label}</button></div>;
  }
}
