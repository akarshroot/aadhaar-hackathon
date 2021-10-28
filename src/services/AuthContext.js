import React, { useContext, useEffect, useState } from "react";
import { auth, initLoggerRegistration, db, addDocRef, collectionRef, setDocRef, docRef } from "./Firebase";
import { useRequestorService } from "./RequestorService";
import requestIp from 'request-ip';



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(true);

    const [requestorUID, setRequestorUID] = useState();
    const [requestorPhnNo, setRequestorPhnNo] = useState(0);
    const [docsAvailable, setDocsStatus] = useState(false);
    const [approvalPending, setApprovalStatus] = useState(false);
    const [requesteeUID, setRequesteeUID] = useState();
    const [requesteePhnNo, setRequesteePhnNo] = useState();


    async function initLogging(auth) {
        try {
            if(auth.currentUser == null)
            {
                await initLoggerRegistration(auth)
                const docReferer = await setDocRef(docRef(db, "sign-in-logs", auth.currentUser.uid), {
                    "phn_no": requestorPhnNo,
                    "date_time": auth.currentUser.metadata.creationTime,
                });
                console.log("currUser(POST Block): " + auth.currentUser);
            }
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setCurrentUser(user)
            setLoading(false)
        })
        initLogging(auth)
    }, [])

    const value = {
        currentUser
    }
    return (
        <AuthContext.Provider value={value}>

            {!loading && children}
        </AuthContext.Provider>
    )
}