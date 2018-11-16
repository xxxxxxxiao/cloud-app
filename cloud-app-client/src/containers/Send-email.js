// The page for sending email to employee

import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel, Well } from "react-bootstrap";
import "./Send-email.css"
import { API } from "aws-amplify"

export default class SendEmail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subject: "",
      content: "",
      user: [],
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }
  
    // Get the employee's information
    try {
      const user = await this.getUser();
      this.setState({ user });
    } catch (e) {
      alert(e);
    } 
  }

  // Get the employee's information from API
  getUser(){ 
    return API.get("user", `/user/${this.props.match.params.id}`)
  }

  // Validate the content form, the content should not be empty
  validateForm() {
    return this.state.content.length && this.state.subject.length > 0;
  }

  // Handle changes in the forms
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  // Handle submit event when clicking to send email
  handleSubmit = async event => {  
    event.preventDefault();
    try {
      const email = await this.sendEmail({
        subject: this.state.subject,
        content: this.state.content,
        receiver: this.state.user.email});
      console.log(email)
      this.props.history.push("/admin");
    } catch (e) {
      alert(e);
    }
  }
  // Send Email by calling API
  sendEmail(sendBody) {
    return API.post("emailto", "/emailto", {
      body: sendBody
    });
  }

  // Render the page
  render() {
    return (
      <div className="SendEmail">
        <form onSubmit={this.handleSubmit}>

          <ControlLabel>Send To</ControlLabel>
            <Well bsSize="small">{this.state.user.email}</Well>

          <FormGroup controlId="subject">
            <ControlLabel>Subject</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.subject}
              type="text"
            />
            <FormControl.Feedback />
          </FormGroup><br />

          <FormGroup controlId="content">
            <ControlLabel>Email Content</ControlLabel>
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
          Send
          </Button>
        </form>
      </div>
    );
  }
}