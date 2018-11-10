import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function({ component: C, props: cProps, ...rest }) {
  //console.log(cProps.isAdmin)
  return(
  <Route
    {...rest}
    render={props =>
      !cProps.isAuthenticated
        ? <C {...props} {...cProps} />
        : cProps.isAdmin
          ?
          <Redirect
          // to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          to="/admin"
          />
          :
          <Redirect
          // to={`/login?redirect=${props.location.pathname}${props.location.search}`}
          to="/empl"
          />
        }
  />
  )
  }