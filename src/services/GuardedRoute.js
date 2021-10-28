import React from 'react';
import { Route, Redirect } from "react-router-dom";
// import { useAuth } from '../AuthContext'


function GuardedRoute({ component: Component, auth, ...rest }){
    // const { currentUser } = useAuth()
    const currentUser = true;
    return(
    <Route {...rest} render={(props) => (
        currentUser
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
    )}

export default GuardedRoute;