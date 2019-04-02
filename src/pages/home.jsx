import React, { Component } from "react";
import Layout from "../components/layout";
import { Redirect } from "react-router-dom";
import { checkIfActiveUser, getActiveUser } from "../utils/defaults";

class Home extends Component {
  state = {};

  render() {
    if (checkIfActiveUser()) {
      return (
        <Layout title={`Player ${getActiveUser()}`}>
          <p>Home</p>
        </Layout>
      );
    } else {
      return <Redirect to="/users" />;
    }
  }
}

export default Home;
