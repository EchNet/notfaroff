import * as React from "react"
import { BrowserRouter as Router, Switch, Redirect, Route} from "react-router-dom"
import socketIOClient from "socket.io-client"

import { apiConnector } from "./connectors"

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
      connected: false,
      error: null
    }
  }
  get connected() {
    return this.state.connected;
  }
  get clientId() {
    return this.props.clientId;
  }
  get appInstId() {
    return this.props.appInstId || this.state.appInstId;
  }
  componentDidMount() {
    this.startUp()
  }
  componentDidUpdate() {
    this.startUp()
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
    const socket = socketIOClient(getSocketEndpoint());
    socket.emit("join", this.appInstId, this.clientId);
    socket.on("gestureEcho", (gesture) => {
      console.log("gestureEcho", gesture)
    });
    this.setState({ connected: true })
  }
  render() {
    return (
      <div>
        { !!this.appInstId && 
            <GameCanvas clientId={this.props.clientId} appInstId={this.state.appInstId}/> }
        { !this.props.appInstId && !!this.appInstId &&
            <div>Send this link to friends: {window.location.href}inst/{this.appInstId}</div> }
      </div>
    )
  }
}

class GameCanvas extends React.Component {
  render() {
    return <canvas width="300" height="200"/>
  }
}

export default MainView
