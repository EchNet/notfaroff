import * as React from "react"

export class PlayNoteButton extends React.Component {
  constructor(props) {
    super(props);
  }
  getNote() {
    return this.props.note || "C3";
  }
  attackNote = () => {
    const synth = this.props.synth;
    const note = this.getNote();
    synth.triggerAttack(note);
  }
  releaseNote = () => {
    const synth = this.props.synth;
    synth.triggerRelease();
  }
  render () {
    const label = this.props.children || this.getNote();
    return <div className="hotbutt"><button onMouseEnter={this.attackNote} onMouseLeave={this.releaseNote}>{label}</button></div>;
  }
}
