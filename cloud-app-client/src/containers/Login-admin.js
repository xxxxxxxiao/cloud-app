import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import "./Login-admin.css";
import { Auth } from "aws-amplify";

export default class LoginAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
  
    try {
      this.props.userIsAdmin(true);
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      let tempUser = await Auth.currentAuthenticatedUser();
      //console.log(tempUser.attributes);
      if (tempUser.attributes['custom:role'] === 'admin')    
      {
        this.props.history.push("/admin");
      }
      else{
        alert("Sorry, you can not access as Admin.")
      }
    } catch (e) {
      alert(e.message);
    }
  }

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
            disabled={!this.validateForm()}
            type="submit"
          >
            Login As Admin
          </Button>
        </form>
      </div>
    );
  }
}