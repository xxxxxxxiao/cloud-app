// The login page for employees

import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login-emply.css";
import { Auth } from "aws-amplify";

export default class LoginEmpl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  // Validate the format of the content in the forms
  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  // Handle changes in the forms
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event when clicking to login
  handleSubmit = async event => {
    event.preventDefault();
  
    try {
      // Set the isAdmin to be false, this is used for the UnauthenticatedRoute
      this.props.userIsAdmin(false);
      // Use Auth.signIn from aws-amplify to sign in
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      // Check the role of the user, raise alert if he is a 'admin'
      let tempUser = await Auth.currentAuthenticatedUser();
      if (tempUser.attributes['custom:role'] !== 'admin')    
      {
        this.props.history.push("/empl");
      }
      else{
        alert("Please login as Admin.");
        this.props.userHasAuthenticated(false);
        this.props.history.push("/");
      }
    } catch (e) {
      alert(e.message);
    }
  }

  // Render the page
  render() {
    return (
      <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <Button
            block
            bsSize="large"
            bsStyle="success"
            disabled={!this.validateForm()}
            type="submit"
          >
            Login As Employee
          </Button>
        </form>
      </div>
    );
  }
}