import axios from "axios";
import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import Layout from "../components/layout";
import { Form, ButtonToolbar } from "react-bootstrap";

import { checkIfActiveUser, getActiveUser, api_url } from "../utils/defaults";

class Home extends Component {
  state = {
    categories: [],
    levels: [{ name: "Easy" }, { name: "Medium" }, { name: "Hard" }],
    activeCategory: 0,
    activeLevel: "Easy"
  };

  componentDidMount() {
    getActiveUser() &&
      axios
        .get(`${api_url}/api_category.php`)
        .then(({ data: { trivia_categories } }) =>
          this.setState({ categories: trivia_categories })
        );
  }

  render() {
    if (checkIfActiveUser()) {
      const { categories, activeCategory, activeLevel, levels } = this.state;
      return (
        <Layout title={`Player ${getActiveUser()}`}>
          <Form.Group>
            <Form.Label>Select Category:</Form.Label>
            <Form.Control
              as="select"
              onChange={({ target }) =>
                this.setState({ activeCategory: target.value })
              }
            >
              <option value={0}>All</option>
              {categories &&
                categories.map(({ id, name }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Select Difficulty:</Form.Label>
            <Form.Control
              as="select"
              onChange={({ target }) =>
                this.setState({ activeLevel: target.value })
              }
            >
              {levels.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <ButtonToolbar>
          <Link className="btn btn-warning" to={`/play/${activeLevel.toLowerCase()}/${activeCategory}`}>
            Play
          </Link>
          <Link to="/highscores" className="btn btn-warning">
            High scores list
          </Link>
          <Link to="/users" className="btn btn-warning">
            Change user
          </Link>
          </ButtonToolbar>
      
        </Layout>
      );
    } else {
      return <Redirect to="/users" />;
    }
  }
}

export default Home;
