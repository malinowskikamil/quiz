import React, { Component } from "react";
import { ListGroup, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Layout from "../components/layout";

class HighScore extends Component {
  state = {};
  render() {
    return (
      <Layout title={"High Score"}>
        <ButtonToolbar>
          <Link to="/" className="btn btn-success">
            New game
          </Link>
          <Link to="/users" className="btn btn-success">
            Change user
          </Link>
        </ButtonToolbar>
        <ListGroup as="ul" className="users-list">
          {JSON.parse(localStorage.getItem("high_scores"))
            .sort((a, b) => b.score - a.score)
            .map(({ name, score }, index) => (
              <ListGroup.Item as={"li"} key={name}>
                <span>
                  {index + 1}. {name}
                </span>
                <span>{score}</span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Layout>
    );
  }
}

export default HighScore;
