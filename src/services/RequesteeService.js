import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { appendToArray, db, docRef, setDocRef, updateDocRef, getDocRef, auth } from "./Firebase";
import { getSignature } from "./Signature";
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from "react-router";


const RequesteeService = React.createContext()

export function useRequesteeService() {
    return useContext(RequesteeService)
}

export function RequesteeServiceProvider({ children }) {

    const { currentUser, setCurrentUser, userPhn } = useAuth();
    const history = useHistory();

    async function grantConsent(data, phn, txn) {
        const date_time = new Date()
        let existenceCheck = docRef(db, "consents", phn)
        const docSnap = await getDocRef(existenceCheck)
        let logData = {
            "requestor_phn": phn,
            "consent_date_time": date_time.toISOString(),
            "txnId": txn,
            "requestee_name": auth.currentUser.displayName,
            "data": data,
            "status": "Approved"
        }
        if (docSnap.exists()) {
            let oldData = docSnap.data()
            if (oldData.hasOwnProperty("pending")) {
                oldData.pending[`${txn}`] = logData
                let checkCompleted = oldData.hasOwnProperty("completed")
                let checkRejections = oldData.hasOwnProperty("rejected")
                if (!checkCompleted)
                    oldData["completed"] = {}
                if (!checkRejections)
                    oldData["rejected"] = {}
                const docReferer = setDocRef(docRef(db, "consents", phn), {
                    pending: oldData.pending,
                    completed: oldData.completed,
                    rejected: oldData.rejected
                });
            }
        } else {
            const docReferer = setDocRef(docRef(db, "consents", phn), {
                pending: logData,
                completed: {},
                rejected: {}
            });
        }
        await setApprovedStatus(txn)
    }

    async function setApprovedStatus(txn) {
        let existenceCheck = docRef(db, "requests", userPhn)
        const docSnap = await getDocRef(existenceCheck)
        if (docSnap.exists()) {
            let data = docSnap.data()
            let approvedReq = data.pending[`${txn}`]
            delete data.pending[`${txn}`]
            let pendingReq = data.pending
            let checkApprovals = data.hasOwnProperty("approved")
            let checkRejections = data.hasOwnProperty("rejected")
            if (checkApprovals) {
                let previousApprovals = data.approved
                previousApprovals[`${txn}`] = approvedReq
                if (checkRejections) {
                    let rejections = data.rejected
                    data = {
                        pending: pendingReq,
                        approved: previousApprovals,
                        rejected: rejections
                    }
                } else {
                    data = {
                        pending: pendingReq,
                        approved: previousApprovals,
                        rejected: {}
                    }
                }
                console.log("using block 1");
            }
            else {
                console.log("using block 2");
                if (checkRejections) {
                    let rejections = data.rejected
                    data = {
                        pending: pendingReq,
                        approved: {
                            [`${txn}`]: approvedReq
                        },
                        rejected: rejections
                    }
                } else {
                    data = {
                        pending: pendingReq,
                        approved: {
                            [`${txn}`]: approvedReq
                        },
                        rejected: {}
                    }
                }
            }
            console.log("final data: " + JSON.stringify(data));
            let existenceCheckApprovedUpdate = docRef(db, "requests", userPhn)
            const docSnapUpdate = await getDocRef(existenceCheckApprovedUpdate)
            if (docSnapUpdate.exists()) {
                const docReferer = setDocRef(docRef(db, "requests", userPhn), {
                    pending: data.pending,
                    approved: data.approved,
                    rejected: data.rejected
                });
            }
        }
    }

    async function rejectConsent(phn, txn) {
        const date_time = new Date()
        let existenceCheck = docRef(db, "consents", phn)
        const docSnap = await getDocRef(existenceCheck)
        let data = {
            "requestor_phn": phn,
            "consent_date_time": date_time.toISOString(),
            "txnId": txn,
            "requestee_name": auth.currentUser.displayName,
            "requestee_phn": userPhn,
            "status": "Rejected"
        }
        if (docSnap.exists()) {
            let oldData = docSnap.data()
            let checkPending = oldData.hasOwnProperty("pending")
            let checkCompleted = oldData.hasOwnProperty("completed")
            let checkRejections = oldData.hasOwnProperty("rejected")
            if (!checkPending)
                oldData["pending"] = {}
            if (!checkCompleted)
                oldData["completed"] = {}
            if (!checkRejections)
                oldData["rejected"] = {}
            oldData.rejected[`${txn}`] = data
            const docReferer = setDocRef(docRef(db, "consents", phn), {
                pending: oldData.pending,
                completed: oldData.completed,
                rejected: oldData.rejected
            });
        } else {
            let data = {
                [`${txn}`]: {
                    "requestor_phn": phn,
                    "consent_date_time": date_time.toISOString(),
                    "txnId": txn,
                    "requestee_name": auth.currentUser.displayName,
                    "requestee_phn": userPhn,
                    "status": "Rejected"
                }
            }
            const docReferer = setDocRef(docRef(db, "consents", phn), {
                pending: {},
                completed: {},
                rejected: data
            });
        }
        await setRejectedStatus(txn, phn)

    }


    async function setRejectedStatus(txn) {
        let existenceCheck = docRef(db, "requests", userPhn)
        const docSnap = await getDocRef(existenceCheck)
        if (docSnap.exists()) {
            let data = docSnap.data()
            let rejectedReq = data.pending[`${txn}`]
            delete data.pending[`${txn}`]
            let pendingReq = data.pending
            let checkApprovals = data.hasOwnProperty("approved")
            let checkRejections = data.hasOwnProperty("rejected")
            if (checkApprovals) {
                let previousApprovals = data.approved
                if (checkRejections) {
                    let rejections = data.rejected
                    rejections[`${txn}`] = rejectedReq
                    data = {
                        pending: pendingReq,
                        approved: previousApprovals,
                        rejected: rejections
                    }
                } else {
                    data = {
                        pending: pendingReq,
                        approved: previousApprovals,
                        rejected: {
                            [`${txn}`]: rejectedReq
                        }
                    }
                }
                console.log("using block 1");
            }
            else {
                console.log("using block 2");
                if (checkRejections) {
                    let rejections = data.rejected
                    rejections[`${txn}`] = rejectedReq
                    data = {
                        pending: pendingReq,
                        approved: {},
                        rejected: rejections
                    }
                } else {
                    data = {
                        pending: pendingReq,
                        approved: {},
                        rejected: {
                            [`${txn}`]: rejectedReq
                        }
                    }
                }
            }
            console.log("final data: " + JSON.stringify(data));
            let existenceCheckRejectedUpdate = docRef(db, "requests", userPhn)
            const docSnapUpdate = await getDocRef(existenceCheckRejectedUpdate)
            if (docSnapUpdate.exists()) {
                const docReferer = setDocRef(docRef(db, "requests", userPhn), {
                    pending: data.pending,
                    approved: data.approved,
                    rejected: data.rejected
                });
            }
        }
    }

    function markFraud(requestorPhn, txnId) {
        alert("User marked suspicious and report sent to uidai");
    }

    const value = {
        grantConsent,
        rejectConsent,
        markFraud
    }
    return (
        <RequesteeService.Provider value={value}>
            {children}
        </RequesteeService.Provider>
    )
}