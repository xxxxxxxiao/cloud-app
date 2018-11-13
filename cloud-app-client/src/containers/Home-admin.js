// The homepage of the admin version

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
      users: [],
      _isMounted: false
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    this._isMounted = true
    // Set the isAdmin to be true, this is used for the UnauthenticatedRoute.js
    this.props.userIsAdmin(true);
    try {
      const projs = await this.getProjs();
      const users = await this.getUsers();
      // Help to check memory leak
      if (this._isMounted){
        this.setState({ projs, users });
      }
    } catch (e) {
      alert(e);
    }
  }
  // Help to check memory leak
  componentWillUnmount() {
    this._isMounted = false
  }
  
  // Get all projects
  getProjs() {
    return API.get("proj", "/proj");
  }

  // Get all users
  getUsers(){
    return API.get("user", "/user")
  }

  // Render the list of all projects
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

  // Render the list of all completed projects
  renderCompProjsList(projs) {
    return [{}].concat(projs).map(
      function(proj, i) {
        if (proj.sta === "Completed") {
          return(
            <LinkContainer
              key={proj.noteID}
              to={`/admin/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>
            </LinkContainer>
          )
        }
      }
    )
  }

  // Render the list of all active projects
  renderActiveProjsList(projs) {
    return [{}].concat(projs).map(
      function(proj, i) {
        if (proj.sta === "Active") {
          return(
            <LinkContainer
              key={proj.noteID}
              to={`/admin/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>
            </LinkContainer>
          )
        }
      }
    )
  }

  // Render the list of all pending projects
  renderPendingProjsList(projs) {
    return [{}].concat(projs).map(
      function(proj, i) {
        if (proj.sta === "Pending") {
          return(
            <LinkContainer
              key={proj.noteID}
              to={`/admin/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>
            </LinkContainer>
          )
        }
      }
    )
  }
  
  // Render the list of all users
  renderUsersList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0
         ?  <ListGroupItem header={user.userName} key={user.userID}>
              {"Skills: " + user.skills}
            </ListGroupItem>
            
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

  // Render page for displaying projects
  renderProjs() {
    return (
      <div className="projs">
        <PageHeader>All Projects</PageHeader>
        <Tabs defaultActiveKey={1} id="projtab" >
          <Tab eventKey={1} title="All Projects">
            <ListGroup>
              {this.renderProjsList(this.state.projs)}
            </ListGroup>
          </Tab>
          <Tab eventKey={2} title="Completed Projects">
            <ListGroup>
              {this.renderCompProjsList(this.state.projs)}
            </ListGroup>
          </Tab>
          <Tab eventKey={3} title="Active Projects">
            <ListGroup>
              {this.renderActiveProjsList(this.state.projs)}
            </ListGroup>
          </Tab>
          <Tab eventKey={4} title="Pending Projects">
            <ListGroup>
              {this.renderPendingProjsList(this.state.projs)}
            </ListGroup>
          </Tab>
        </Tabs>
      </div>
    );
  }

  // Render the page for displaying users
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

  // Render tabs to switch between users and projects
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