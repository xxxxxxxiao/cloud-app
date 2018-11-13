// The page for creating new project

import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel, DropdownButton, MenuItem, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import "./New-proj.css"
import { API } from "aws-amplify"

export default class NewProj extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      content: "",
      manager: "None",
      sta: "Pending",
      users: [],
      developers: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    // Get all employees
    try {
      const users = await this.users();
      this.setState({ users });
    } catch (e) {
      alert(e);
    } 
  }

  // Get all employees from API
  users(){ 
    return API.get("user", "/user")
  }

  // Validate the content form, the content should not be empty
  validateForm() {
    return this.state.content.length > 0;
  }

  // Handle changes in the forms
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle the event when selecting manager.
  handleSelect = event => {
    this.setState({ manager: event});
  }

  // Handle the event when selecting developers
  handleDevSelect = event => {
    this.setState({ developers: event});
  }

  // Handle submit event to create a new project
  handleSubmit = async event => {
    event.preventDefault();
    
    try {
      await this.createProj({
        content: this.state.content,
        title: this.state.title,
        manager: this.state.manager,
        sta: this.state.sta,
        developers: this.state.developers
        
      });
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
    }
  }
  // Create project by calling API
  createProj(proj) {
    return API.post("proj", "/proj", {
      body: proj
    });
  }

  // Render the menu to show all employees for selecting a manager
  renderUserList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0 ?
          <MenuItem eventKey={user.userName} key={i}>{user.userName}</MenuItem>
        : <div key={i}></div>   
    );
  }

  // Render the buttons to show all employees for selecting developers
  renderDevList(users) {
    return [{}].concat(users).map(
      (user, i) =>
        i !== 0 ?
          <ToggleButton value={user.userName} key={i}>{user.userName}</ToggleButton>
        : <div key={i}></div>
    );
  }

  // Render the page
  render() {
    return (
      <div className="NewProj">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title">

            <ControlLabel>Project Title</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              type="text"
            />
            <FormControl.Feedback />
          </FormGroup><br />

          <ControlLabel>Project Manager</ControlLabel>
          <DropdownButton
            title={this.state.manager}
            id={"dropdown-basic"}
            onSelect={this.handleSelect}
          >
            <MenuItem eventKey={"None"} key={0}>None</MenuItem>
            {this.renderUserList(this.state.users)}
          </DropdownButton><br /><br />

          <ControlLabel>Project Developers</ControlLabel><br />
          <ToggleButtonGroup
            type="checkbox"
            onChange={this.handleDevSelect}
          >
            {this.renderDevList(this.state.users)}
          </ToggleButtonGroup><br /><br />

          <FormGroup controlId="content">
            <ControlLabel>Project Details</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea"
            />
          </FormGroup><br />

          <Button
            block
            bsStyle="primary"
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
          Create
          </Button>
        </form>
      </div>
    );
  }
}