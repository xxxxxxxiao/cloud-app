// The page of showing a project in developer version 

import React, { Component } from "react";
import { Well, ControlLabel, Label } from "react-bootstrap";
import { API } from "aws-amplify";
import "./Proj-dev.css"

export default class ProjDeveloper extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
        proj: null,
        title: "",
        content: "",
        sta: "",
        developers: [],
        manager: "",

    };
  }

  // Get informations
  async componentDidMount() {
    try {
      const proj = await this.getProj();
      const { title, content, sta, developers, manager } = proj;

      this.setState({
        proj,
        title,
        content,
        sta,
        developers,
        manager,
      });
    } catch (e) {
      alert(e);
    }
  }

  // Call API to get this project
  getProj() {
    return API.get("proj", `/proj/${this.props.match.params.id}`);
  }

  // Render the label to show all developers 
  renderDevList(devs) {
    return devs.map(
      function(dev, i){
        return (<Label key={i}>{dev}</Label>)
      }    
    );
  }

  // Render the page
  render() {
    return (
      <div className="ProjDeveloper">

            <ControlLabel>Project Title</ControlLabel>
              <Well bsSize="small">&nbsp; {this.state.title}</Well>

             <ControlLabel>Project Manager</ControlLabel><br />
              <Label>{this.state.manager}</Label>
            <br /><br />

            <ControlLabel>Project Developers</ControlLabel><br />
              {this.renderDevList(this.state.developers)}
            <br /><br />
            

            <ControlLabel>Project Status</ControlLabel><br />
              <Label>{this.state.sta}</Label>
            <br /><br />

            <ControlLabel>Project Details</ControlLabel>
              <Well bsSize="small">&nbsp; {this.state.content}</Well>
  
      </div>
    );
  }
}