import React from "react";
import { Switch } from "react-router-dom";
import Home from "./containers/Home";
import LoginAdmin from "./containers/Login-admin";
import NewProj from "./containers/New-proj";
import ProjAdmin from "./containers/Proj-admin";
import HomeAdmin from "./containers/Home-admin";
import AddEmpl from "./containers/Add-empl";
import LoginEmpl from "./containers/Login-empl"
import HomeEmpl from "./containers/Home-empl"
import ProjManager from "./containers/Proj-manager"
import ProjDeveloper from "./containers/Proj-dev"
import Setting from "./containers/Setting"
import Password from "./containers/Password"
import NotFound from "./containers/NotFound"
import SendEmail from "./containers/Send-email"

import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";



export default ({ childProps }) =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Home} props={childProps} />
    <AuthenticatedRoute path="/admin" exact component={HomeAdmin} props={childProps} />
    <UnauthenticatedRoute path="/adminlogin" exact component={LoginAdmin} props={childProps}/>
    <AuthenticatedRoute path="/admin/new" exact component={NewProj} props={childProps} />
    <AuthenticatedRoute path="/admin/:id" exact component={ProjAdmin} props={childProps} />
    <AuthenticatedRoute path="/newuser" exact component={AddEmpl} props={childProps} />
    <UnauthenticatedRoute path="/empllogin" exact component={LoginEmpl} props={childProps} />
    <AuthenticatedRoute path="/empl" exact component={HomeEmpl} props={childProps} />
    <AuthenticatedRoute path="/manager/:id" exact component={ProjManager} props={childProps} />
    <AuthenticatedRoute path="/empl/:id" exact component={ProjDeveloper} props={childProps} />
    <AuthenticatedRoute path="/empl/setting/:id" exact component={Setting} props={childProps} />
    <AuthenticatedRoute path="/empl/setting/:id/password" exact component={Password} props={childProps} />
    <AuthenticatedRoute path="/admin/email/:id" exact component={SendEmail} props={childProps} />


    <AppliedRoute component={NotFound} />

  </Switch>;