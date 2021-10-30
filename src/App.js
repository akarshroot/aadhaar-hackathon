import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import GuardedRoute from './services/GuardedRoute';
import { AuthProvider, useAuth } from './services/AuthContext';
import { RequestorServiceProvider } from './services/RequestorService';
import Navbar from './Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { LoopCircleLoading } from 'react-loadingg';
import ChangeAddress from './pages/ChangeAddress';
import ViewRequest from './pages/ViewRequest';
import { RequesteeServiceProvider } from './services/RequesteeService';
import CompleteRequest from './pages/CompleteRequest';


function App() {
  const [tempLoader, setTempLoader] = useState(true)
  function fakeRequest() {
    return new Promise(resolve => setTimeout(() => resolve(), 2000));
  }

  useEffect(() => {
    fakeRequest().then(() => {
      if (true) {
        setTempLoader(!tempLoader);
      }
    });
  }, []);
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <RequestorServiceProvider>
            <RequesteeServiceProvider>
          {!tempLoader?
            <>
            <Navbar />
            <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
          {/* Put user specific pages in GuardedRoute tags) */}
            <GuardedRoute path="/dashboard" exact component={Dashboard} />
            <GuardedRoute path="/changeaddress" exact component={ChangeAddress} />
            <GuardedRoute path="/request" exact component={ViewRequest} />
            <GuardedRoute path="/completerequest" exact component={CompleteRequest} />
          {/* <GuardedRoute path="/changeaddress" exact component={ChangeAddress} /> */}
          {/* <GuardedRoute path="/request" exact component={Request} /> */}


          {/* Put Error: 404 page route in the end.*/}
          {/* <Route component={NotFound}></Route> */}
            </Switch>
            </>
            :
            <LoopCircleLoading />
          }
          </RequesteeServiceProvider>
        </RequestorServiceProvider>
      </AuthProvider>
    </Router>

    </div >
  )
}

export default App;
