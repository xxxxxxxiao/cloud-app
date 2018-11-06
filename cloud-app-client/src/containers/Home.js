import React, { Component } from "react";
import {Button} from "react-bootstrap"
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import "./Home.css";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projs: [],
      users: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    try {
      const projs = await this.projs();
      const users = await this.users();
      this.setState({ projs, users });
    } catch (e) {
      alert(e);
    }
  
  }
  
  projs() {
    return API.get("proj", "/proj");
  }

  users(){
    return API.get("user", "/user")
  }

  renderProjsList(projs) {
    return [{}].concat(projs).map(
      (proj, i) =>
        i !== 0
          ? <LinkContainer
              key={proj.noteID}
              to={`/proj/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/proj/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new project
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }

  renderUsersList(users) {
    return [{}].concat(users).map(
      (user, i) =>
      i !== 0
          ?<LinkContainer
          key={user.userID}
          to={`/user/${user.userID}`}
          >
          <ListGroupItem header={user.name}>
            {"Role: " + user.role}
          </ListGroupItem>
          </LinkContainer>
          : <LinkContainer
          key="new"
          to="/user/new"
        >
          <ListGroupItem>
            <h4>
              <b>{"\uFF0B"}</b> Create a new User
            </h4>
          </ListGroupItem>
        </LinkContainer>
    );
  }


  renderLander() {
    return (
      <div className="lander">
        <LinkContainer to="/adminlogin">
        <Button
            bsSize="large"
            bsStyle="success"
            //disabled={!this.validateForm()}
            type="submit"
            block
          >
            Login As Admin
        </Button>
        </LinkContainer>

        <Button
            bsSize="large"
            bsStyle="success"
            //disabled={!this.validateForm()}
            type="submit"
            block
          >
            Login As Employee
        </Button>

      </div>
    );
  }

  renderProjs() {
    return (
      <div className="projs">
        <PageHeader>All Projects</PageHeader>
        <ListGroup>
          {this.renderProjsList(this.state.projs)}
        </ListGroup>
      </div>
    );
  }

  renderUsers(){
    return (
      <div className="users">
        <PageHeader>All Users</PageHeader>
        <ListGroup>
          {this.renderUsersList(this.state.users)}
        </ListGroup>
      </div>
    )
  }


  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ?  (this.renderProjs(), this.renderUsers()) : this.renderLander()}
      </div>
    );
  }
}