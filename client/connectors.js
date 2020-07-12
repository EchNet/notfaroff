import axios from "axios";

function toQueryString(params) {
  return Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  ).join("&")
}

class ApiConnector {
  constructor(props) {
    this.props = props || {}
  }
  _doGet(uri, data={}) {
    const salt = Math.random().toString(16).substring(2)
    const queryString = toQueryString(Object.assign({ _: salt }, data))
    return axios.get(`${uri}?${queryString}`, {
      withCredentials: true,
      headers: {
        Accept: "application/json"
      }
    })
  }
  _doPost(uri, data) {
    return axios.post(uri, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json"
      }
    })
  }
  _doPut(uri, data) {
    return axios.put(uri, data, {
      withCredentials: true,
      headers: {
        Accept: "application/json"
      }
    })
  }
  getClient() {
    return this._doGet("/client")
  }
  listAppInstances(clientId) {
    return this._doGet("/app/jackson/", { client: clientId })
  }
  createAppInstance(clientId) {
    return this._doPost("/app/jackson", { client: clientId })
  }
  getAppInstanceState(appInstId) {
    return this._doGet(`/api/jackson/${appInstId}`)
  }
}

export const apiConnector = new ApiConnector()
