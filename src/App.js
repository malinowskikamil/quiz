import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Users from './pages/users'
import Home from "./pages/home";
import Game from "./pages/game";
import HighScore from "./pages/highscore";
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/users" component={Users} />
        <Route exact path={`/play/:level/:category`} component={Game} />
        <Route exact path={`/highscores`} component={HighScore} />
      </Switch>
    );
  }
}

export default App;
