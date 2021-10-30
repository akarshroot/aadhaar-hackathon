import React from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GuardedRoute from './services/GuardedRoute';
import { AuthProvider } from './services/AuthContext';
import { RequestorServiceProvider } from './services/RequestorService';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <RequestorServiceProvider>
            <Switch>
              <Route path="/" exact component={Home} />
              {/* Put user specific pages in GuardedRoute tags) */}
              {/* <GuardedRoute path="/dashboard" exact component={Dashboard} /> */}
              {/* <GuardedRoute path="/changeaddress" exact component={ChangeAddress} /> */}
              {/* <GuardedRoute path="/request" exact component={Request} /> */}


              {/* Put Error: 404 page route in the end.*/}
              {/* <Route component={NotFound}></Route> */}
            </Switch>
          </RequestorServiceProvider>
        </AuthProvider>
      </Router>

    </div>
  );
}

export default App;
