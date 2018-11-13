// Generate navigation bar

import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import Routes from "./Route"
import { Auth } from "aws-amplify"
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
  
    // Define some globle variances
    this.state = {
      // Variance used for check authenticated status
      isAuthenticated: false,
      isAuthenticating: true,
      // Variance used for checking if the user is admin (used in UnahenticatedRoute)
      isAdmin: false
    };
  }

  // Check if the user is authenticated
  async componentDidMount() {
    try {
      await Auth.currentSession();
      this.userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
  
    this.setState({ isAuthenticating: false });
  }
  
  // Check if the user is authenticated
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  // Check if the user is admin
  userIsAdmin = admin => {
    this.setState({ isAdmin: admin});
  }

  // Handle logout event
  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.userIsAdmin(false);
    this.props.history.push("/");
  }

  // Render the page
  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      isAdmin: this.state.isAdmin,
      userIsAdmin: this.userIsAdmin,
    };
    return (
      !this.state.isAuthenticating &&
      <div className="App">
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/">Project Management System</Link>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
          <Nav pullRight>
            {this.state.isAuthenticated
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : <Fragment>
                </Fragment>
              }
          </Nav>
        </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);
