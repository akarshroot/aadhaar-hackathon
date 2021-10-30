import React, { useContext, useEffect, useState } from "react";
import { auth, initLoggerRegistration, db, addDocRef, collectionRef, setDocRef, docRef, updateProfileData } from "./Firebase";
import { useRequestorService } from "./RequestorService";
import requestIp from 'request-ip';



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(true);
        
    const [userName, setUserName] = useState(sessionStorage.getItem("name"))
    const [userPhn, setUserPhone] = useState(sessionStorage.getItem("phone-number"))

    function initLogging() {
        try {
            if(auth.currentUser == null)
            {
                initLoggerRegistration(auth).then(() => {
                    updateSignInLogs()
                })
                console.log("currUser(POST Block): " + auth.currentUser);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function updateSignInLogs() {
        setUserName(sessionStorage.getItem("name"))
        setUserPhone(sessionStorage.getItem("phone-number"))
        console.log(userName + " " + userPhn);
        await updateProfileData(auth.currentUser, {
          displayName: userName
        }).then(() => {
          // Profile updated!
          // ...
          console.log(auth.currentUser.displayName);

        }).catch((error) => {
          // An error occurred
          // ...
          console.error(error);
        });
        const date = new Date()
        const docReferer = await setDocRef(docRef(db, "sign-in-logs", auth.currentUser.uid), {
            "phn_no": userPhn,
            "creation_date_time": auth.currentUser.metadata.creationTime,
            "last_login_date_time": date.toISOString()
        });
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setCurrentUser(user)
            setLoading(false)
        })
    }, [])

    const value = {
        currentUser,
        initLogging,
        userPhn
    }
    return (
        <AuthContext.Provider value={value}>

            {!loading && children}
        </AuthContext.Provider>
    )
}