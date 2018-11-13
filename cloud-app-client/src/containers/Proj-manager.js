// The page of editing a project in Manager version.
// This one is almost the same as Admin version except cannot delete a project here.

import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel, ToggleButtonGroup, ToggleButton, ButtonToolbar } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import "./Proj-manager.css"

export default class ProjManager extends Component {
  constructor(props) {
    super(props);

    this.handleDevSelect = this.handleDevSelect.bind(this);

    this.state = {
        proj: null,
        title: "",
        content: "",
        sta: "",
        developers: [],
        users: [],
        manager: "",
        dropDownTitle: "",
        name: ""
    };
  }

  // Get informations
  async componentDidMount() {
    try {
      // Get the information of this project
      const proj = await this.getProj();
      // Get all users
      const users = await this.getUsers();
      const { title, content, sta, developers, manager } = proj;
      // Get the name of current user
      let tempUser = await Auth.currentAuthenticatedUser();
      let name = tempUser.attributes['name']

      this.setState({
        proj,
        title,
        content,
        sta,
        developers,
        manager,
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
        developers: this.state.developers,

      });
      this.props.history.push("/empl");
    } catch (e) {
      alert(e);
    }
  }

  // Save the projcet
  saveProj(proj) {
    return API.put("proj", `/proj/${this.props.match.params.id}`, {
      body: proj
    });
  }
  
  // Handle the event when selecting developers
  handleDevSelect = event => {
    this.setState({ developers: event});
  }

  // Handle the event when changing the status
  handleStatusSelect = event => {
    this.setState({ sta: event});
  }
  
  // Render the buttons to show all employees for selecting developers
  renderDevList(users) {
    return [{}].concat(users).map(
      function(user, i){
        if (i !== 0){
          return(<ToggleButton value={user.userName} key={i}>{user.userName}</ToggleButton>)
          //return(<Button key={i}>{user.name}</Button>)
        }
      }    
    );
  }

  // Render the page
  render() {
    return (
      // Check if the current login user have the right to modify the project
      this.state.name === this.state.manager
      ?
      <div className="ProjManager">
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
            </FormGroup>

            <ControlLabel>Project Developers</ControlLabel>
            <ToggleButtonGroup
              type="checkbox"
              value={this.state.developers}
              onChange={this.handleDevSelect}
            >
              {this.renderDevList(this.state.users)}
            </ToggleButtonGroup><br />

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
            </ButtonToolbar>


            <FormGroup controlId="content">
              <ControlLabel>Project Details</ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
              />
            </FormGroup>

            <Button
              block
              bsStyle="primary"
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
            Save
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