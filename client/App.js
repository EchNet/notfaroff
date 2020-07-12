import * as React from "react"
import ImportedCookies from "cookies-js";

import { Instrument } from "./components"
import WaitScreen from "./WaitScreen"
import ErrorScreen from "./ErrorScreen"
import { apiConnector } from "./connectors"


export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      clientId: null,
      appInstId: null,
      loading: false,
      loaded: false,
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
    console.log('startUp...')
    if (this.state.loading || this.state.loaded || this.state.error) {
      // Not able to proceed at this point.
      console.log('... nothing to do')
      return
    }
    if (!this.state.clientId) {
      console.log("... got no clientId")
      let cookieClientId = ImportedCookies.get("client")
      if (cookieClientId) {
        console.log("... got cookie client id", cookieClientId)
        this.setState({ clientId: cookieClientId });
      }
      else {
        this.setState({ loading: true });
        console.log("... fetching")
        apiConnector.getClient()
          .then((response) => {
            console.log("Fetched client id", response.data.id)
            this.setState({ clientId: response.data.id, loading: false });
            ImportedCookies.set("client", response.data.id)
          })
          .catch((error) => {
            this.setState({ error: error.toString(), loading: false });
          })
        return;
      }
    }
    if (!this.state.appInstId) {
      console.log("... got no appInstId")
      this.setState({ loading: true });
      console.log("... fetching")
      apiConnector.createAppInstance(this.state.clientId)
        .then((response) => {
          console.log("fetched app id", response.data.id)
          this.setState({ clientId: response.data.id, loading: false, loaded: true });
        })
        .catch((error) => {
          this.setState({ error: error.toString(), loading: false });
        })
    }
  }
  render() {
    return (
      <div style={{ height: "100%" }}>
        { !!this.state.loading && <WaitScreen/> }
        { !!this.state.loaded && <Instrument appInstId={this.state.appInstId}/> }
        { !!this.state.error && <ErrorScreen fatal="fatal" message={this.state.error}/> }
      </div>
    )
  }
}

export default App
