import React, { useContext, useEffect, useState } from "react";
import { auth, initLoggerRegistration, db, addDocRef, collectionRef, setDocRef, docRef, updateProfileData, onSnapshotRef } from "./Firebase";
import { useRequestorService } from "./RequestorService";
import requestIp from 'request-ip';
import { useHistory } from "react-router";



const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState("");
    const [loading, setLoading] = useState(true);
    const [initUserLoading, setInitUserLoading] = useState(false);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [pendingConsents, setPendingConsents] = useState([]);
    const history = useHistory()

    const [userName, setUserName] = useState(sessionStorage.getItem("name"))
    const [userPhn, setUserPhone] = useState(sessionStorage.getItem("phone-number"))

    function initLogging() {
        try {
            if (auth.currentUser == null) {
                initLoggerRegistration(auth).then(() => {
                    updateSignInLogs()
                })
                console.log("currUser(POST Block): " + auth.currentUser);
            }
        } catch (err) {
            console.error(err);
        }
    }

    function setUpRequestListener(userPhn) {
        const unsub = onSnapshotRef(docRef(db, "requests", userPhn), (doc) => {
            console.log("Pending Requests Array: ", doc.data())
            setPendingRequests(doc.data())
        });
        console.log("logging requests");
    }

    function setUpConsentListener(userPhn) {
        const unsub = onSnapshotRef(docRef(db, "consents", userPhn), (doc) => {
            console.log("Pending Consents Array: ", doc.data())
            setPendingConsents(doc.data())
        });
        console.log("logging consents");
    }

    async function updateSignInLogs() {
        setUserName(sessionStorage.getItem("name"))
        setUserPhone(sessionStorage.getItem("phone-number"))
        const localUserName = sessionStorage.getItem("name")
        const localUserPhn = sessionStorage.getItem("phone-number")
        console.log(localUserName + " " + localUserPhn);
        await updateProfileData(auth.currentUser, {
            displayName: localUserName,
            photoURL: localUserPhn
        }).then(() => {
            // Profile updated!
            // ...
            console.log(auth.currentUser.displayName);
            console.log(auth.currentUser.photoURL);
            // setUpRequestListener(localUserPhn)

        }).catch((error) => {
            // An error occurred
            // ...
            console.error(error);
        });
        const date = new Date()
        const docReferer = await setDocRef(docRef(db, "sign-in-logs", auth.currentUser.uid), {
            "phn_no": localUserPhn,
            "creation_date_time": auth.currentUser.metadata.creationTime,
            "last_login_date_time": date.toISOString()
        });
        setUpRequestListener(localUserPhn)
        setUpConsentListener(localUserPhn)
        history.push("/dashboard")
        setInitUserLoading(false)
    }

    function signout() {
        auth.signOut()
        sessionStorage.clear()
        history.push("/")
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log(user);
            setCurrentUser(user)
            setLoading(false)
            console.log(userPhn);
            if (auth.currentUser) { 
                setUpRequestListener(auth.currentUser.photoURL) 
                setUpConsentListener(auth.currentUser.photoURL) 
            }
        })
    }, [])

    const value = {
        currentUser,
        initLogging,
        userPhn,
        signout,
        initUserLoading,
        setInitUserLoading,
        loading,
        pendingRequests,
        pendingConsents
    }
    return (
        <AuthContext.Provider value={value}>

            {!loading && children}
        </AuthContext.Provider>
    )
}