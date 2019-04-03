import React, { Component } from "react";
import Layout from "../components/layout";
import { Button, ListGroup, Form, Alert, ButtonToolbar } from "react-bootstrap";

Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key));
};

class Users extends Component {
  state = {
    addUserOpen: false,
    newUser: "",
    activeUser: sessionStorage.getObj("active_user"),
    users: localStorage.getObj("users"),
    error: null
  };

  handleAddUser = () => {
    const { newUser } = this.state;
    if (!localStorage.getObj("users")) {
      localStorage.setObj("users", []);
    }
    let users = localStorage.getObj("users");
    if (users.find(({ name }) => name === newUser)) {
      this.setState({ error: `User ${newUser} already exists` });
      setTimeout(() => {
        this.setState({ error: null });
      }, 2000);
    } else {
      const newUsers = users.concat([{ name: newUser }]);
      localStorage.setObj("users", newUsers);
      this.setState({ newUser: "", users: newUsers });
    }
  };

  handleDeleteUser = user => {
    let users = localStorage.getObj("users");
    const newUsers = users.filter(({ name }) => name !== user);
    localStorage.setObj("users", newUsers);
    this.setState({ users: newUsers });
  };

  handleActivateUser = user => {
    sessionStorage.setObj("active_user", user);
    this.setState({ activeUser: user });
  };

  render() {
    const { users, addUserOpen, newUser, error, activeUser } = this.state;
    return (
      <Layout title={"List of users"}>
        <p>Choose an user</p>
        <ListGroup as="ul" className="users-list">
          {users && users.length > 0 &&
            users.map(({ name }) => (
              <ListGroup.Item as="li" key={name}>
                <span>{name}</span>
                <ButtonToolbar>
                  <Button
                    variant="success"
                    as="input"
                    type="button"
                    value={"Activate"}
                    onClick={() => this.handleActivateUser(name)}
                    disabled={name === activeUser}
                  />
                  <Button
                    variant="danger"
                    as="input"
                    type="button"
                    value={"Delete"}
                    onClick={() => this.handleDeleteUser(name)}
                    disabled={name === activeUser}

                  />
                </ButtonToolbar>
              </ListGroup.Item>
            ))}
          {users && users.length === 0 && <p>There's no users yet. Please create one</p>}
        </ListGroup>
        <Button
          variant="primary"
          onClick={() => this.setState({ addUserOpen: !addUserOpen })}
        >
          Add {users && users.length === 0 ? "" : "another"} user
        </Button>
        {activeUser && activeUser.length && (
          <Button
            variant="primary"
            onClick={() => window.location.pathname = '/'}
          >
            Play as {activeUser}
          </Button>
        )}
        <div className={`create-user-container ${addUserOpen ? "open" : ""}`}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>User name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Name"
              value={this.state.newUser}
              onChange={e => this.setState({ newUser: e.target.value })}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          {newUser.length > 2 && (
            <Button variant="primary" onClick={() => this.handleAddUser()}>
              Add
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}

export default Users;
