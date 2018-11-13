// The homepage, users can select login as admin or employee

import React, { Component } from "react";
import {Button} from "react-bootstrap"
import "./Home.css";
import { LinkContainer } from "react-router-bootstrap";

export default class Home extends Component {


  render() {
    return (
      <div className="Home">
        <LinkContainer to="/adminlogin">
        <Button
            bsSize="large"
            bsStyle="primary"
            type="submit"
            block
          >
            Login As Admin
        </Button>
        </LinkContainer>
        <br /><br />
        <LinkContainer to="/empllogin">
        <Button
            bsSize="large"
            bsStyle="primary"
            type="submit"
            block
          >
            Login As Employee
        </Button>
        </LinkContainer>
      </div>
    );
  }
}