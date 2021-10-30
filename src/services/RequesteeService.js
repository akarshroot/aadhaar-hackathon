import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { appendToArray, db, docRef, setDocRef, updateDocRef, getDocRef, auth } from "./Firebase";
import { getSignature } from "./Signature";
import { v4 as uuidv4 } from 'uuid'


const RequesteeService = React.createContext()

export function useRequesteeService() {
    return useContext(RequesteeService)
}

export function RequesteeServiceProvider({ children }) {

    const { currentUser, setCurrentUser, userPhn } = useAuth();

    function grantConsent(requestorPhn, txnId, ) {

    }

    const value = {
        
    }
    return (
        <RequesteeService.Provider value={value}>
            {children}
        </RequesteeService.Provider>
    )
}