import React, { Component } from "react";
import { FormGroup, FormControl, Button, ControlLabel, MenuItem, ToggleButtonGroup, ToggleButton, ButtonToolbar } from "react-bootstrap";
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

  async componentDidMount() {
    try {
      const proj = await this.getProj();
      const users = await this.getUsers();
      const { title, content, sta, developers, manager } = proj;
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

  getUsers(){
    return API.get("user", "/user")
  }

  getProj() {
    return API.get("proj", `/proj/${this.props.match.params.id}`);
  }


  validateForm() {
    return this.state.content.length > 0;
  }
  
  
  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

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

  saveProj(proj) {
    return API.put("proj", `/proj/${this.props.match.params.id}`, {
      body: proj
    });
  }
  
  deleteProj() {
    return API.del("proj", `/proj/${this.props.match.params.id}`);
  }
  
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
      this.props.history.push("/emply");
    } catch (e) {
      alert(e);
    }
  }

  generateDevList(users) {
    return [{}].concat(users).map(
      function(user, i){
        if (i !== 0){
          return(<ToggleButton value={user.name} key={i}>{user.name}</ToggleButton>)
          //return(<Button key={i}>{user.name}</Button>)
        }
      }    
    );
  }

  handleDevSelect = event => {
    this.setState({ developers: event});
  }

  handleStatusSelect = event => {
    this.setState({ sta: event});
  }
  
  render() {
    return (
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
              {this.generateDevList(this.state.users)}
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