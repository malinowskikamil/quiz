import React, { Component } from "react";
import Layout from "../components/layout";
import { checkIfActiveUser } from "../utils/defaults";

class Home extends Component {
  state = {};

  componentDidMount() {
    checkIfActiveUser();
  }

  render() {
    return (
      <Layout>
        <p>Home</p>
      </Layout>
    );
  }
}

export default Home;
