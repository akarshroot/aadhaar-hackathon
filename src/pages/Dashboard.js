import React from 'react'
import { useHistory } from 'react-router'
import { useAuth } from '../services/AuthContext'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, pendingRequests, pendingConsents } = useAuth()
    const history = useHistory();

    function goToRequest(txnId, phn, name, date, sign) {
        history.push("/request?txnId=" + txnId + "&phn=" + phn + "&name=" + name + "&date=" + date + "&sign=" + sign)
    }

    function goToCompleteRequest(txnId, phn, name, date, data) {
        history.push("/completerequest?txnId=" + txnId + "&phn=" + phn + "&name=" + name + "&date=" + date + "&data=" + data)
    }

    return (
        <div>
            <div class="sections">
                <div class="functions">
                    <h1>Welcome, {currentUser.displayName}</h1><br />
                    <button type="start" onClick={() => { history.push("/changeaddress") }} className="btn-dashboard btn btn-primary btn-block">Change Address</button><br />
                    <button type="start" className="btn-dashboard btn btn-primary btn-block">View History</button><br />
                </div>
                <div class="pending-requests">
                    <h3>Pending Address Requests</h3>
                    <hr />
                    {/* <ul>
                        <li></li>
                    </ul> */}
                    {pendingRequests && pendingRequests.pending ? Object.keys(pendingRequests.pending).map((key, request) => (
                        console.log(),
                        <ul onClick={() => {
                            goToRequest(pendingRequests.pending[key].txnId, pendingRequests.pending[key].requestor_phn, pendingRequests.pending[key].requestor_name, pendingRequests.pending[key].request_date_time, pendingRequests.pending[key].signature)
                        }} style={{ textDecoration: "none", listStyle: "none", cursor: "pointer", padding: "10px", borderRadius: "12px", border: "1px solid black" }}>
                            <li>Requested By: {pendingRequests.pending[key].requestor_phn}</li>
                        </ul>
                    )) : <>No new requests</>}
                </div>
                <div class="pending-consents">
                    <h3>Awaiting Completeion</h3>
                    <hr />
                    {/* <ul>
                        <li></li>
                    </ul> */}
                    {
                        pendingConsents && pendingConsents.pending ? Object.keys(pendingConsents.pending).map((key, request) => (
                            console.log(),
                            <ul onClick={() => {
                                goToCompleteRequest(pendingConsents.pending[key].txnId, pendingConsents.pending[key].requestor_phn, pendingConsents.pending[key].requestee_name, pendingConsents.pending[key].consent_date_time, pendingConsents.pending[key].data)
                            }} style={{ textDecoration: "none", listStyle: "none", backgroundColor: "green", color: "white", cursor: "pointer", padding: "10px", borderRadius: "12px", border: "1px solid black" }}>
                                <li>Approved By: {pendingConsents.pending[key].requestee_name}</li>
                                <span id="subtext" style={{color: "white"}}>Click to complete your address change process.</span>
                            </ul>
                        )) : <>No request</>
                    }
                    {
                        pendingConsents && pendingConsents.rejected ? Object.keys(pendingConsents.rejected).map((key, request) => (
                            console.log(),
                            <ul style={{ textDecoration: "none", backgroundColor: "#cc3300", color: "white", listStyle: "none", padding: "10px", borderRadius: "12px", border: "1px solid black" }}>
                                <li>Rejected By: {pendingConsents.rejected[key].requestee_name}</li>
                                <span id="subtext" style={{color: "white"}}>Please contact your introducer and request him/her to approve your request.</span>
                            </ul>
                        )) : <></>
                    }
                </div>
            </div>
        </div>
    )
}

export default Dashboard
