import * as React from "react"
import ImportedCookies from "cookies-js";

import MainView from "./MainView"
import ErrorScreen from "./ErrorScreen"
import { apiConnector } from "./connectors"


export class App extends React.Component {
  // Once client ID is obtained, show main view.
  constructor(props) {
    super(props)
    this.state = {
      clientId: null,
      busy: false,
      error: null
    }
  }
  componentDidMount() {
    this.startUp()
  }
  componentDidUpdate() {
    this.startUp()
  }
  startUp() {
    if (this.state.busy || this.state.clientId || this.state.error) {
      // Not able to proceed at this point.
    }
    else {
      let cookieClientId = ImportedCookies.get("client")
      if (cookieClientId) {
        this.setState({ clientId: cookieClientId });
      }
      else {
        this.setState({ busy: true });
        apiConnector.getClient()
          .then((response) => {
            this.setState({ clientId: response.data.id || "invalid", busy: false });
            ImportedCookies.set("client", response.data.id)
          })
          .catch((error) => {
            this.setState({ error: error.toString(), busy: false });
          })
      }
    }
  }
  render() {
    return (
      <div>
        { !!this.state.clientId && <MainView clientId={this.state.clientId}/> }
        { !!this.state.error && <ErrorScreen fatal="fatal" message={this.state.error}/> }
      </div>
    )
  }
}

export default App
