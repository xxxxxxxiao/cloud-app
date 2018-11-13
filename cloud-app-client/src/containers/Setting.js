// The page of settings

import React, { Component } from "react";
import { FormGroup, FormControl, Button, PageHeader } from "react-bootstrap";
import { API, Auth } from "aws-amplify";
import "./Setting.css"

export default class Setting extends Component {
  constructor(props) {
    super(props);

    this.state = {
        user: [],
        skills: [],
        userName: "",
        currentuser: ""
    };
  }

  // Get the user's information
  async componentDidMount() {
    try {
      const user = await this.getUser();
      const { userName, skills } = user
      // Get the name of the current login user
      let tempUser = await Auth.currentAuthenticatedUser();
      const currentuser = tempUser.attributes['name']

      this.setState({
        userName,
        skills,
        user,
        currentuser,
      });
    } catch (e) {
      alert(e);
    }
  }

  // Get the information of the user
  getUser(){
    return API.get("user", `/user/${this.props.match.params.id}`)
  }

  // Handle changes in the forms  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event when clicking to change the skills
  handleSubmit = async event => {  
    event.preventDefault();
  
    try {
      await this.saveUser({
        userName: this.state.userName,
        skills: this.state.skills
      });
      this.props.history.push("/empl");
    } catch (e) {
      alert(e);
    }
  }

  // Call the API the save user information
  saveUser(user) {
    return API.put("user", `/user/${this.props.match.params.id}`, {
      body: user
    });
  }

  // Render the page
  render() {
    return (
      // Check if the current user have the right to modify
      this.state.userName === this.state.currentuser
      ?
      <React.Fragment>
        <div className="Password">
        <PageHeader>Password</PageHeader>
          <Button
            block
            bsStyle="danger"
            bsSize="large"
            href={`/empl/setting/${this.props.match.params.id}/password`}
          >
          Change Password
          </Button>
        
        </div>
        <div className="Setting">
          {this.state.user &&
            <form onSubmit={this.handleSubmit}>
              <PageHeader>Your skills</PageHeader>
              <FormGroup controlId="skills">
                <FormControl
                  onChange={this.handleChange}
                  value={this.state.skills}
                  componentClass="textarea"
                />
              </FormGroup>
              <Button
                block
                bsStyle="primary"
                bsSize="large"
                type="submit"
              >
              Save
              </Button>

            </form>
          }
        </div>
      </React.Fragment>

      :
      <div className="warning">
        <h1>You have no right to modify the user informations.</h1>
        </div>
    );
  }
}