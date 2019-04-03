import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import Main from "./components/main";
class App extends Component {
  render() {
    return (
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Main />
      </BrowserRouter>
    );
  }
}

export default App;
