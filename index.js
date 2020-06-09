import * as React from "react"
import { render } from "react-dom"
import { Instrument } from "./components";
import "./components.css";

const App:React.SFC = () => <Instrument/>;

render(<App/>, document.getElementById("root"));

if (module.hot) {
  module.hot.accept()
}
