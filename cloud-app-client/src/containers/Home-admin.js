import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Tabs, Tab } from "react-bootstrap";
import "./Home-admin.css";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";

export default class HomeAdmin extends Component {
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
              to={`/admin/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/admin/new"
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
         ?  <LinkContainer
              key={user.userID}
              to={`/admin/${user.userID}`}
            >
            <ListGroupItem header={user.name}>
              {"Skills: " + user.skills}
            </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="newuser"
              to="/newuser"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new employee account
                </h4>
              </ListGroupItem>
            </LinkContainer>
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

  renderTabs() {
    return (
      <Tabs defaultActiveKey={1} id="tab" >
        <Tab eventKey={1} title="Projects">
          {this.renderProjs()}
        </Tab>
        <Tab eventKey={2} title="Users">
          {this.renderUsers()}
        </Tab>
      </Tabs>
    );
  }


  render() {
    return (
      <div className="HomeAdmin">
        {this.renderTabs()} 
      </div>
    );
  }
}