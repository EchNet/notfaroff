import * as React from "react"
import { BrowserRouter as Router, Switch, Redirect, Route} from "react-router-dom"
import socketIOClient from "socket.io-client"

import { apiConnector } from "./connectors"
import "./MainView.css"

function getSocketEndpoint() {
  const url = window.location.href;
  const arr = url.split("/");
  return arr[0] + "//" + arr[2];
}

export class MainView extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/inst/:appInstId"
              render={(props) => <GameView clientId={this.props.clientId} appInstId={props.match.params.appInstId}/>} />
          <Route path="*" render={() => <GameView clientId={this.props.clientId}/>}/>
        </Switch>
      </Router>
    )
  }
}

class GameView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appInstId: null,
      socket: false,
      appState: [],
      error: null
    }
  }
  get connected() {
    return !!this.state.socket;
  }
  get clientId() {
    return this.props.clientId;
  }
  get appInstId() {
    return this.props.appInstId || this.state.appInstId;
  }
  componentDidMount() {
    this.startUp()
    this.updateCanvas()
  }
  componentDidUpdate() {
    this.startUp()
    this.updateCanvas()
  }
  startUp() {
    if (!this.appInstId) {
      apiConnector.createAppInstance(this.clientId)
        .then((response) => {
          this.setState({ appInstId: response.data.id });
        })
        .catch((error) => {
          this.setState({ error: error.toString() });
        })
    }
    else if (!this.connected) {
      this.connect()
    }
  }
  connect() {
    const self = this;
    const socket = socketIOClient(getSocketEndpoint());
    socket.on("connect", () => {
      console.log('Client connected');
      socket.emit("join", self.appInstId, self.clientId);
    })
    socket.on("reconnect", () => {
      console.log('Client reconnected');
      socket.emit("join", self.appInstId, self.clientId);
    })
    socket.on("gestureEcho", (gesture) => {
      console.log("gestureEcho", gesture)
    });
    socket.on("stateChange", (newState) => {
      console.log("stateChange", newState)
      this.setState({ appState: newState })
    });
    this.setState({ socket })
  }
  updateCanvas() {
    const canvas = this.refs.drawLayer;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (this.state.appState) {
      this.state.appState.forEach((ele) => {
        context.beginPath();
        context.arc(ele.x, ele.y, 10, 0, 2*Math.PI, false);
        context.fillStyle = "blue";
        context.fill();
      })
    }
  }
  render() {
    return (
      <div className="GameView">
        <div className="canvasContainer">
          <canvas ref="drawLayer" width="300" height="200"></canvas>
          <canvas ref="gestureLayer" width="300" height="200" onClick={(event) => this.handleCanvasClick(event)}></canvas>
        </div>
        { !this.props.appInstId && !!this.appInstId &&
            <div>
              <span>Send this link to friends: </span>
              <span>{window.location.href}inst/{this.appInstId}</span>
            </div> }
      </div>
    )
  }
  handleCanvasClick(event) {
    var rect = event.target.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    this.state.socket.emit("gesture", { type: "click", x, y })
  }
}

export default MainView
