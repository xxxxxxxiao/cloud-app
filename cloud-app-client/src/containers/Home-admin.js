// The homepage of the admin version

import React, { Component } from "react";
import { PageHeader, ListGroup, ListGroupItem, Tabs, Tab, 
         InputGroup, DropdownButton, FormControl, Button, 
         MenuItem, FormGroup } from "react-bootstrap";
import "./Home-admin.css";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";

export default class HomeAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      projs: [],
      users: [],
      search: "",
      searchOption: "Employee",
      searchResult: "",
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
      (proj, i) =>
        proj.sta === "Completed" ?      
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
        : <div key={i}></div>
    )
  }

  // Render the list of all active projects
  renderActiveProjsList(projs) {
    return [{}].concat(projs).map(
      (proj, i) =>
        proj.sta === "Active" ?
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
        : <div key={i}></div> 
    )
  }

  // Render the list of all pending projects
  renderPendingProjsList(projs) {
    return [{}].concat(projs).map(
      (proj, i) =>
        proj.sta === "Pending" ?
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
        : <div key={i}></div>    
    );
  }
  
  // Render the list of all users
  renderUsersList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0
         ?  
            <LinkContainer
              key = {user.userID}
              to= {`/admin/email/${user.userID}`}
            >
              <ListGroupItem header={user.userName} key={user.userID}>
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

  // Handle change in the form when doing search
  handleChange = async event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle selection event when selecting to search by employee or project
  handleSelectSearch = event => {
    this.setState({ searchOption: event });
    this.setState({ searchResult: "" });
  }

  // Handle click event when clicking to search
  handelClick = async event => {
    event.preventDefault();

    let temp = this.state.search.toLocaleLowerCase();
    var result = [];
    // Check that if want to search by employee or project
    this.state.searchOption === "Employee" ?
      this.state.users.forEach(function(user){
        if (user.userName.toLocaleLowerCase().indexOf(temp) !== -1){
          result.push(user);
        }
      })
    : this.state.projs.forEach(function(proj) {
        if (proj.title.toLocaleLowerCase().indexOf(temp) !== -1) {
          result.push(proj);
        }
      });
    
    this.setState({
      searchResult: result
    })
  }

  // Render the search form and button
  renderSearch(){
    return (
      <div className="search">
        <br /><br />
          <FormGroup controlId="search">
            <InputGroup>
              <DropdownButton
                componentClass={InputGroup.Button}
                id="input-dropdown"
                title={this.state.searchOption}
                onSelect={this.handleSelectSearch}
              >
                <MenuItem eventKey={"Employee"}>Employee</MenuItem>
                <MenuItem eventKey={"Project"}>Project</MenuItem>
              </DropdownButton>
              <FormControl
                value={this.state.search}
                type="text"
                onChange={this.handleChange}
              />
            </InputGroup>
          </FormGroup>
          <Button
            block
            bsStyle="primary"
            bsSize="large"
            onClick={this.handelClick}
          >
          Search
          </Button>
      </div>
    )
  }

  // Render the search result
  renderResult() {
    return (
      this.state.searchResult ?
        (this.state.searchOption === "Employee" 
          ? this.state.searchResult.map(user =>
            <LinkContainer
              key = {user.userID}
              to= {`/admin/email/${user.userID}`}
            >
              <ListGroupItem header={user.userName} key={user.userID}>
                {"Skills: " + user.skills}
              </ListGroupItem>
            </LinkContainer>)
          : this.state.searchResult.map(proj =>
            <LinkContainer
            key={proj.noteID}
            to={`/admin/${proj.noteID}`}
            >
              <ListGroupItem header={proj.title}>
                {"Project Manager: " + proj.manager}<br />
                {"Developers: " + proj.developers}<br />
                {"Status: " + proj.sta}
              </ListGroupItem>
            </LinkContainer>)
        ) 
      :
      <div className="None">
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
        <Tab eventKey={3} title="Search">
          {this.renderSearch()}
          <ListGroup><br /><br />
          {this.renderResult()}
          </ListGroup>
        </Tab>
      </Tabs>
    );
  }

  render() {
    return (
      this.props.isAdmin ?
        <div className="HomeAdmin">
          {this.renderTabs()} 
        </div>
      :
        <div className="warning">
          <h1>You have no right to enter as Admin.</h1>
        </div>
    );
  }
}