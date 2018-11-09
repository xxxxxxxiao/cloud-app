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

import AppliedRoute from "./components/AppliedRoute";



export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/admin" exact component={HomeAdmin} props={childProps} />
    <AppliedRoute path="/adminlogin" exact component={LoginAdmin} props={childProps}/>
    <AppliedRoute path="/admin/new" exact component={NewProj} props={childProps} />
    <AppliedRoute path="/admin/:id" exact component={ProjAdmin} props={childProps} />
    <AppliedRoute path="/newuser" exact component={AddEmpl} props={childProps} />
    <AppliedRoute path="/empllogin" exact component={LoginEmpl} props={childProps} />
    <AppliedRoute path="/empl" exact component={HomeEmpl} props={childProps} />

  </Switch>;