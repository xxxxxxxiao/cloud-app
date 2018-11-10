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

  getProj() {
    return API.get("proj", `/proj/${this.props.match.params.id}`);
  }

  generateDevList(devs) {
    return devs.map(
      function(dev, i){
        return (<Label key={i}>{dev}</Label>)
      }    
    );
  }

  render() {
    return (
      <div className="ProjDeveloper">

            <ControlLabel>Project Title</ControlLabel>
              <Well bsSize="small">&nbsp; {this.state.title}</Well>

             <ControlLabel>Project Manager</ControlLabel><br />
              <Label>{this.state.manager}</Label>
            <br /><br />

            <ControlLabel>Project Developers</ControlLabel><br />
              {this.generateDevList(this.state.developers)}
            <br /><br />
            

            <ControlLabel>Project Status</ControlLabel><br />
              <Label>{this.state.sta}</Label>
            <br /><br />

            <ControlLabel>Project Details</ControlLabel>
              <p><Well bsSize="small">&nbsp; {this.state.content}</Well></p>
  
      </div>
    );
  }
}