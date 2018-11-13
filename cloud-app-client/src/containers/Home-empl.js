// The homepage of employee version

import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Tabs, Tab } from "react-bootstrap";
import "./Home-empl.css";
import { LinkContainer } from "react-router-bootstrap";
import { API, Auth } from "aws-amplify";

export default class HomeEmpl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projs: [],
      users: [],
      name: "",
      userID: "",
      _isMounted: false
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
    
    this._isMounted = true
    try {
      const projs = await this.getProjs();
      const users = await this.getUsers();
      // Get the name of the employee login now
      let currentUser = await Auth.currentAuthenticatedUser();
      const name = currentUser.attributes['name'];
      const userID = this.getUserID(name, users);
      // Help to check memory leak
      if (this._isMounted){
        this.setState({ projs, users, name, userID });
      }
    } catch (e) {
      alert(e);
    }
  }
  // Help to check memory leak
  componentWillUnmount() {
    this._isMounted = false
  }

  // Find the patition key of the user in DynamoDb
  getUserID(name, users) {
    return users.find(user => user.userName === name).userID
  }
  
  // Get all projects
  getProjs() {
    return API.get("proj", "/proj");
  }

  // Get all users
  getUsers(){
    return API.get("user", "/user")
  }

  // Render the list of projects managed by the employee
  renderManagedProjsList(projs) {
    let username = this.state.name;
    return [{}].concat(projs).map(
      function(proj, i){
        if (i !== 0){
          if (proj.manager === username){
            return(
              <LinkContainer
                key={proj.noteID}
                to={`/manager/${proj.noteID}`}
              >
                <ListGroupItem header={proj.title} >
                  {"Project Manager: " + proj.manager}<br />
                  {"Developers: " + proj.developers}<br />
                  {"Status: " + proj.sta}
                </ListGroupItem>
              </LinkContainer>
            )
          }
        }
      }     
    );
  }

  // Render the list of projects that he employee involved
  renderInvolvedProjsList(projs) {
    let username = this.state.name;
    return [{}].concat(projs).map(
      function(proj, i){
        if (proj.developers && proj.developers.indexOf(username) !== -1 
            && proj.manager && proj.manager!== username) {
              return(
                <LinkContainer
                key={proj.noteID}
                to={`/empl/${proj.noteID}`}
              >
                <ListGroupItem header={proj.title} key={proj.noteID}>
                  {"Project Manager: " + proj.manager}<br />
                  {"Developers: " + proj.developers}<br />
                  {"Status: " + proj.sta}
                </ListGroupItem>  
                </LinkContainer>
              )          
        }
      }
    );
  }

  // Render the list of other projects
  renderOtherProjsList(projs) {
    let username = this.state.name;
    return [{}].concat(projs).map(
      function(proj, i){
        if (i !== 0){
          if (proj.manager !== username && proj.developers && proj.developers.indexOf(username) === -1){
            return(
              <ListGroupItem header={proj.title} key={proj.noteID}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>  
            )
          }  
        }
      }
    );
  }

  // Render the list of showing all users
  renderUsersList(users) {
    let username = this.state.name;
    return [{}].concat(users).map(
      function(user, i){
          if (i !== 0){
            if (user.userName !== username){
                return(
                    <ListGroupItem header={user.userName} key={user.userID}>
                        {"Skills: " + user.skills}
                    </ListGroupItem>
                )
            }
          }
      }
    );
  }

  // Render the project page
  renderProjs() {
    return (
      <React.Fragment>
      <div className="managedprojs">
        <PageHeader>Projects managed by you</PageHeader>
        <ListGroup>
          {this.renderManagedProjsList(this.state.projs)}
        </ListGroup>
      </div><br />
      <div className="involvedprojs">
        <PageHeader>Involved projects</PageHeader>
        <ListGroup>
          {this.renderInvolvedProjsList(this.state.projs)}
        </ListGroup>
      </div><br />
      <div className="projs">
        <PageHeader>Other projects</PageHeader>
        <ListGroup>
          {this.renderOtherProjsList(this.state.projs)}
        </ListGroup>
      </div>
      </React.Fragment>
    );
  }

  // Render the user page
  renderUsers(){
    return (
      <React.Fragment>
      <div className="user">
        <PageHeader>You</PageHeader>
          <LinkContainer
              key={"setting"}
              to={`/empl/setting/${this.state.userID}`}
          >
            <ListGroupItem active>
                <h4>
                <b></b> Settings
                </h4>
            </ListGroupItem>
          </LinkContainer>
      </div>
      <div className='otherusers'>
        <PageHeader>Other Employees</PageHeader>
          <ListGroup>
            {this.renderUsersList(this.state.users)}
          </ListGroup>
      </div>
      </React.Fragment>
    )
  }

  // Render tabs to allow switching between project page and user page
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
      <div className="HomeEmpl">
        {this.renderTabs()} 
      </div>
    );
  }
}