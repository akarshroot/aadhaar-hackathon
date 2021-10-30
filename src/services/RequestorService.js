import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { appendToArray, db, docRef, setDocRef, updateDocRef, getDocRef } from "./Firebase";
import { getSignature } from "./Signature";
import { v4 as uuidv4 } from 'uuid'


const RequestorService = React.createContext()

export function useRequestorService() {
    return useContext(RequestorService)
}

export function RequestorServiceProvider({ children }) {

    const { currentUser, setCurrentUser, userPhn } = useAuth();

    async function logRequest(requesteePhnNo, signature) {
        const date_time = new Date()
        const txn = uuidv4()
        let existenceCheck = docRef(db, "requests", requesteePhnNo)
        const docSnap = await getDocRef(existenceCheck)
        if (docSnap.exists()) {
            const docReferer = updateDocRef(docRef(db, "requests", requesteePhnNo), {
                pending: appendToArray({
                    "requestor_phn": userPhn,
                    "request_date_time": date_time.toISOString(),
                    "signature": signature,
                    "txnId": txn
                })
            });
        } else {
            const docReferer = setDocRef(docRef(db, "requests", requesteePhnNo), {
                pending: appendToArray({
                    "requestor_phn": userPhn,
                    "request_date_time": date_time.toISOString(),
                    "signature": signature,
                    "txnId": txn
                })
            });
        }
    }

    function generateApprovalRequest(requesteePhnNo) {
        //log a request for introducer's address
        const signatureData = getSignature()
        alert("Preserve this key till end of the process: " + signatureData.privateKey)
        logRequest(requesteePhnNo, signatureData.publicKey)

    }

    const value = {
        generateApprovalRequest
    }
    return (
        <RequestorService.Provider value={value}>

            {children}
        </RequestorService.Provider>
    )
}