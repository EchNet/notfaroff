import * as React from "react"
import * as Tone from "tone"
import socketIOClient from "socket.io-client"

class NoteButton extends React.Component {
  constructor(props) {
    super(props);
  }
  getContext() {
    return this.props.context;
  }
  getNote() {
    return this.props.note || "C3";
  }
  targetNote() {
    console.log("targetNote", this.getNote());
    this.getContext().targetNote(this.getNote());
  }
  releaseNote() {
    console.log("releaseNote", this.getNote());
    this.getContext().releaseNote(this.getNote());
  }
  render () {
    return (
      <div className="NoteButton"
           onMouseEnter={() => this.targetNote()}
           onMouseLeave={() => this.releaseNote()}>{this.props.children}</div>
    )
  }
}

function getEndpoint() {
  const url = window.location.href;
  const arr = url.split("/");
  return arr[0] + "//" + arr[2];
}

export class Instrument extends React.Component {
  constructor(props) {
    super(props);

    const socket = socketIOClient(getEndpoint());
    console.log('joining', props.gameid)
    socket.emit("joinGame", props.gameid);
    socket.on("targetNote", (note) => {
      console.log("received targetNote", note);
      this.playNote(note)
    });
    socket.on("releaseNote", (note) => {
      console.log("received releaseNote", note);
      this.releaseAll()
    });

    const synth = new Tone.Synth({
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

    this.state = {
      active: false,
      synth: synth,
      note: null,
      glissando: false,
      socket: socket
    }
  }
  targetNote(note) {
    if (note !== this.state.note) {
      this.playNote(note);
      this.state.socket.emit("targetNote", note)
    }
  }
  playNote(note) {
    if (this.state.glissando && this.state.note) {
      this.state.synth.portamento = 0.5;
      this.state.synth.setNote(note);
    }
    else {
      this.state.synth.triggerAttack(note);
    }
    this.setState({ note });
  }
  releaseNote(note) {
    if (this.state.glissando) {
      setTimeout(() => {
        if (this.state.note === note) {
          this.releaseAll();
          this.state.socket.emit("releaseNote", note)
        }
      }, 10);
    }
    else if (this.state.note === note) {
      this.releaseAll();
      this.state.socket.emit("releaseNote", note)
    }
  }
  releaseAll() {
    this.setState({ note: null })
    this.state.synth.triggerRelease()
  }
  setGlissando(glissando) {
    this.releaseAll();
    this.setState({ glissando })
  }
  activate() {
    this.setState({ active: true })
  }
  render() {
    return (
      <div className="Instrument">
        {this.state.active && (
          <div>
            <div className="Keyboard" onMouseLeave={() => this.releaseAll()}>
              <NoteButton context={this} note="B2">B</NoteButton>
              <NoteButton context={this} note="C3">C</NoteButton>
              <NoteButton context={this} note="D3">D</NoteButton>
              <NoteButton context={this} note="E3">E</NoteButton>
              <NoteButton context={this} note="F3">F</NoteButton>
              <NoteButton context={this} note="G3">G</NoteButton>
            </div>
            <div className="GlissandoControl">
              <input type="checkbox"
                     checked={this.state.glissando}
                     onChange={(e) => this.setGlissando(e.target.checked)}/> Glissando
            </div>
          </div>
        )}
        {!this.state.active && (
          <div onClick={() => this.activate()}>Click here to activate (that's life)</div>
        )}
      </div>
    )
  }
}
