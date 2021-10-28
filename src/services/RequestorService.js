import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { auth, initLoggerRegistration, db, addDocRef, collectionRef } from "./Firebase";


const RequestorService = React.createContext()

export function useRequestorService() {
    return useContext(RequestorService)
}

export function RequestorServiceProvider({ children }) {

    const [loading, setLoading] = useState(true);
    const { currentUser, setCurrentUser } = useAuth();

    const value = {
        
    }
    return (
        <RequestorService.Provider value={value}>

            {!loading && children}
        </RequestorService.Provider>
    )
}