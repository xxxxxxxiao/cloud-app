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
  
    try {
      const users = await this.users();
      this.setState({ users });
    } catch (e) {
      alert(e);
    } 
  }
  users(){
    return API.get("user", "/user")
  }

  generateUserList(users) {
    //return [{}].concat(users).map((user, index) => (
    //  <MenuItem eventKey={index}>user</MenuItem>
    //));

    return [{}].concat(users).map(
      function(user, i){
        if (i !== 0){
          return(<MenuItem eventKey={user.userName} key={i}>{user.userName}</MenuItem>)
          //return(<Button key={i}>{user.name}</Button>)
        }
      }    
    );
  }

  generateDevList(users) {
    return [{}].concat(users).map(
      function(user, i){
        if (i !== 0){
          return(<ToggleButton value={user.userName} key={i}>{user.userName}</ToggleButton>)
          //return(<Button key={i}>{user.name}</Button>)
        }
      }    
    );
  }


  validateForm() {
    return this.state.content.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSelect = event => {
    this.setState({ manager: event});
  }

  handleDevSelect = event => {
    this.setState({ developers: event});
  }



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
  
  createProj(proj) {
    return API.post("proj", "/proj", {
      body: proj
    });
  }

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
          </FormGroup>

          <ControlLabel>Project Manager</ControlLabel>
          <DropdownButton
            title={this.state.manager}
            id={"dropdown-basic"}
            onSelect={this.handleSelect}
          >
            <MenuItem eventKey={"None"} key={0}>None</MenuItem>
            {this.generateUserList(this.state.users)}
          </DropdownButton>

          <ControlLabel>&nbsp; Project Developers</ControlLabel>
          <ToggleButtonGroup
            type="checkbox"
            onChange={this.handleDevSelect}
          >
            {this.generateDevList(this.state.users)}
          </ToggleButtonGroup>

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
          Create
          </Button>
        </form>
      </div>
    );
  }
}