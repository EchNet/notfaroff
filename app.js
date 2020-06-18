import * as React from "react"
import { render } from "react-dom"
import { Instrument } from "./components"
import "./components.css"

((rootEle, RootComponent) => {
  const getDataAttrs = (attrs) => {
    const dataAttrs = {};
    for (var i = attrs.length; --i >= 0; ) {
      const name = attrs[i].name;
      if (name.startsWith("data-")) {
        dataAttrs[name.substring(5)] = attrs[i].value;
      }
    }
    return dataAttrs;
  }
  render(<RootComponent {...getDataAttrs(rootEle.attributes)}/>, rootEle)
})(document.getElementById("root"), Instrument)

if (module.hot) {
  module.hot.accept()
}
