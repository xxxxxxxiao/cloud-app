// The page for changing password

import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Password.css";
import { Auth } from "aws-amplify";

export default class Password extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    };
  }

  // Validate the format of the content in the forms
  validateForm() {
    return (this.state.oldPassword.length > 0 && 
            this.state.newPassword.length > 0 &&
            this.state.newPassword === this.state.confirmPassword);
  }

  // Handle changes in the forms
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event when clicking to change the password
  handleSubmit = async event => {
    event.preventDefault();
  
    try {
      let tempUser = await Auth.currentAuthenticatedUser();
      // Call Auth.changePassword to change password
      await Auth.changePassword(tempUser, this.state.oldPassword, this.state.newPassword);
      this.props.history.push("/empl");
    } catch (e) {
      alert(e.message);
    }
  }

  // Render the page
  render() {
    return (
      <div className="Password">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="oldPassword" bsSize="large">
            <ControlLabel>Old Password</ControlLabel>
            <FormControl
              autoFocus
              type="password"
              value={this.state.oldPassword}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="newPassword" bsSize="large">
            <ControlLabel>New Password</ControlLabel>
            <FormControl
              value={this.state.newPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <FormGroup controlId="confirmPassword" bsSize="large">
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            disabled={!this.validateForm()}
            type="submit"
          >
            Change
          </Button>
        </form>
      </div>
    );
  }
}