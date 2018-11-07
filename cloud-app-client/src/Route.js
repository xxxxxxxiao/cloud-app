import React from "react";
import { Switch } from "react-router-dom";
import Home from "./containers/Home";
import LoginAdmin from "./containers/Login-admin"
import NewProj from "./containers/New-proj";
import ProjAdmin from "./containers/Proj-admin"

import AppliedRoute from "./components/AppliedRoute";



export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/adminlogin" exact component={LoginAdmin} props={childProps}/>
    <AppliedRoute path="/proj/new" exact component={NewProj} props={childProps} />
    <AppliedRoute path="/proj/:id" exact component={ProjAdmin} props={childProps} />

  </Switch>;