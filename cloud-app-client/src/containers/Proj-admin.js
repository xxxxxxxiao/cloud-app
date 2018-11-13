// The page of editing a project in Admin version

import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel, DropdownButton, MenuItem, ToggleButtonGroup, ToggleButton, ButtonToolbar } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import "./Proj-admin.css"

export default class ProjAdmin extends Component {
  constructor(props) {
    super(props);

    this.handleDevSelect = this.handleDevSelect.bind(this);

    this.state = {
        proj: null,
        title: "",
        content: "",
        manager: "",
        sta: "",
        developers: [],
        users: [],
        name: "",
        admin: "Admin",
        dropDownTitle: ""
    };
  }

  // Get informations
  async componentDidMount() {
    try {
      // Get the information of this project
      const proj = await this.getProj();
      // Get all users
      const users = await this.getUsers();
      const { title, content, manager, sta, developers } = proj;
      // Get the name of current user
      let tempUser = await Auth.currentAuthenticatedUser();
      let name = tempUser.attributes['name']

      this.setState({
        proj,
        title,
        content,
        manager,
        sta,
        developers,
        users,
        name
      });
    } catch (e) {
      alert(e);
    }
  }

  // Call API to get all users
  getUsers(){
    return API.get("user", "/user")
  }

  // Call API to get this project
  getProj() {
    //console.log(this.props.match.params.id)
    return API.get("proj", `/proj/${this.props.match.params.id}`);
  }

  // The content should not be empty
  validateForm() {
    return this.state.content.length > 0;
  }
  
  // Handle changes in the forms  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event when clicking to save the change
  handleSubmit = async event => {  
    event.preventDefault();
  
    try {
      await this.saveProj({
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

  // Save the project
  saveProj(proj) {
    return API.put("proj", `/proj/${this.props.match.params.id}`, {
      body: proj
    });
  }
  
  // Delete the project
  deleteProj() {
    return API.del("proj", `/proj/${this.props.match.params.id}`);
  }

  // Handel the delete event
  handleDelete = async event => {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
    
    try {
      await this.deleteProj();
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
    }
  }

  // Handle the event when selecting manager.
  handleSelect = event => {
    this.setState({ manager: event });
  }

  // Handle the event when selecting developers
  handleDevSelect = event => {
    this.setState({ developers: event});
  }

  // Handle the event when changing the status
  handleStatusSelect = event => {
    this.setState({ sta: event});
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
      // Check if the current login user is Admin or not
      this.props.isAdmin ?
        <div className="ProjAdmin">
          {this.state.proj &&
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
              </DropdownButton> <br /><br />


              <ControlLabel>Project Developers</ControlLabel><br />
              <ToggleButtonGroup
                type="checkbox"
                value={this.state.developers}
                onChange={this.handleDevSelect}
              >
                {this.renderDevList(this.state.users)}
              </ToggleButtonGroup><br /><br />

              <ControlLabel>Project Status</ControlLabel>
              <ButtonToolbar>
                <ToggleButtonGroup
                  type="radio"
                  name="status"
                  onChange={this.handleStatusSelect}
                  defaultValue={this.state.sta}
                >
                  <ToggleButton value={"Completed"}>Completed</ToggleButton>
                  <ToggleButton value={"Active"}>Active</ToggleButton>
                  <ToggleButton value={"Pending"}>Pending</ToggleButton>
                </ToggleButtonGroup>
              </ButtonToolbar><br />


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
              Save
              </Button>
              <Button
                block
                bsStyle="danger"
                bsSize="large"
                onClick={this.handleDelete}
              >
              Delete
              </Button>
            </form>
          }
        </div>
      :
        <div className="warning">
          <h1>You have no right to modify the project.</h1>
        </div>
    );
  }
}