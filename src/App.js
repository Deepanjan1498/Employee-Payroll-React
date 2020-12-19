import React from 'react';
import './App.css';
import PayrollForm from './component/payroll-form/payroll-form'
import Home from "./component/home/home.jsx";
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
class App extends React.Component{
  render(){
    return(
      <div className = "App">
        <div className = "App">
      <Router>
      <Switch>
      <Route  path ="/employee">
      <PayrollForm />
      </Route>
      <Route path ="/home">
        <Home />
      </Route>
      <Route exact path="/employee/:id">
            <PayrollForm />
          </Route>
          <Route exact path="">
            <Redirect exact from="/" to="/home" />
          </Route>
      </Switch>
      </Router>
      </div>
      </div>
    );
    }
  }

export default App;