import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { appendToArray, db, docRef, setDocRef, updateDocRef, getDocRef, auth } from "./Firebase";
import { getSignature } from "./Signature";
import { v4 as uuidv4 } from 'uuid'


const RequestorService = React.createContext()

export function useRequestorService() {
    return useContext(RequestorService)
}

export function RequestorServiceProvider({ children }) {

    const { currentUser, setCurrentUser, userPhn } = useAuth();

    async function logRequest(requesteePhnNo, signature, userPhn) {
        const date_time = new Date()
        const txn = uuidv4()
        let existenceCheck = docRef(db, "requests", requesteePhnNo)
        signature = Buffer.from(signature)
        signature = signature.toString('base64')
        const docSnap = await getDocRef(existenceCheck)
        if (docSnap.exists()) {
            let oldData = docSnap.data()
            if (oldData.hasOwnProperty("pending")) {
                let data = {
                    "requestor_phn": userPhn,
                    "request_date_time": date_time.toISOString(),
                    "signature": signature,
                    "txnId": txn,
                    "requestor_name": auth.currentUser.displayName
                }
                oldData.pending[`${txn}`] = data
                let checkApprovals = oldData.hasOwnProperty("approved")
                let checkRejections = oldData.hasOwnProperty("rejected")
                if (!checkApprovals)
                    oldData["approved"] = {}
                if (!checkRejections)
                    oldData["rejected"] = {}
                const docReferer = setDocRef(docRef(db, "requests", requesteePhnNo), {
                    pending: oldData.pending,
                    approved: oldData.approved,
                    rejected: oldData.rejected
                });
            } else {
                let data = {
                    [`${txn}`]: {
                        "requestor_phn": userPhn,
                        "request_date_time": date_time.toISOString(),
                        "signature": signature,
                        "txnId": txn,
                        "requestor_name": auth.currentUser.displayName
                    }
                }
                let checkApprovals = oldData.hasOwnProperty("approved")
                let checkRejections = oldData.hasOwnProperty("rejected")
                if (!checkApprovals)
                    oldData["approved"] = {}
                if (!checkRejections)
                    oldData["rejected"] = {}
                const docReferer = setDocRef(docRef(db, "requests", requesteePhnNo), {
                    pending: data,
                    approved: oldData.approved,
                    rejected: oldData.rejected
                });
            }
        } else {
            let data = {
                [`${txn}`]: {
                    "requestor_phn": userPhn,
                    "request_date_time": date_time.toISOString(),
                    "signature": signature,
                    "txnId": txn,
                    "requestor_name": auth.currentUser.displayName
                }
            }
            const docReferer = setDocRef(docRef(db, "requests", requesteePhnNo), {
                pending: data,
                approved: {},
                rejected: {}
            });
        }
    }
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    function generateApprovalRequest(requesteePhnNo, userPhn) {
        //log a request for introducer's address
        const signatureData = getSignature()
        document.getElementById("userkey").innerHTML = ("Preserve this key till end of the process:<br/> " + signatureData.privateKey)
        download(("temporary_private_key_" + userPhn), signatureData.privateKey)
        logRequest(requesteePhnNo, signatureData.publicKey, userPhn)
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