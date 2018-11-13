// The page of adding an employee

import React, { Component } from "react";
import { FormGroup, FormControl, ControlLabel, Button } from "react-bootstrap";
import { Auth, API } from "aws-amplify";
import "./Add-empl.css"

export default class AddEmpl extends Component {
  constructor(props) {
    super(props);
    
    // Initialize the state
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      role: "",
      newUser: null
    };
  }

  // Validate the format of the information is correct
  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  // Handle change in the form
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event to create a new employee
  handleSubmit = async event => {
    event.preventDefault();
    
    try {
      // Call Auth.signUp function in aws-amplify to sign up a user
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes: {
          email: this.state.email,
          name: this.state.name,
        }
      });

      // Add the name of the new user to the table in DynamoDb
      await this.createUser({
        userName: this.state.name,
      })

      this.setState({
        newUser
      });
      // Return to main page
      this.props.history.push("/admin");
    } catch (e) {
      alert(e.message);
    }
  }

  // Function to add new user to DynamoDb
  createUser(user) {
    return API.post("user", "/user", {
      body: user
    });
  }


  // Render the forms and button
  renderForm() {
    return (
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
        <FormGroup controlId="name" bsSize="large">
          <ControlLabel>Name</ControlLabel>
          <FormControl
            value={this.state.name}
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
        <FormGroup controlId="confirmPassword" bsSize="large">
          <ControlLabel>Confirm Password</ControlLabel>
          <FormControl
            value={this.state.confirmPassword}
            onChange={this.handleChange}
            type="password"
          />
        </FormGroup>
        <Button
          bsSize="large"
          disabled={!this.validateForm()}
          type="submit"
          block
        >
        Add New Employee
        </Button>
      </form>
    );
  }

  render() {
    return (
      <div className="AddEmpl">
        {this.renderForm()}
      </div>
    );
  }
}