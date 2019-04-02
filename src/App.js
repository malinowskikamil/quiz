import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Users from './pages/users'
import Home from "./pages/home";
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
      </Switch>
    );
  }
}

export default App;
