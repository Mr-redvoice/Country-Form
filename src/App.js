import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Country from "./Country";
import PageNotFound from "./PageNotFound";
import Portfolio from "./portFolio";
import './App.css';

function App(){
    return (
        
        <Router>
      <div className="NavBar">
        <div className="navItems">
              <Link to="/">PortFolio</Link>
              </div>
              <div className="navItems">
              <Link to="/Country">Country Form</Link>
              </div>
              </div>
        <Fragment>
        <Switch>
          <Route path="/Country" >
            <Country />
          </Route>
          <Route path="/" >
            <Portfolio />
          </Route>
          <Route path="*" >
            <PageNotFound />
          </Route>
        </Switch>
        </Fragment>
      
    </Router>
    )
}

export default App