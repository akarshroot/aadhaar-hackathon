import React from 'react'
import { useHistory } from 'react-router'
import { useAuth } from '../services/AuthContext'
import './Dashboard.css'

function Dashboard() {
    const { currentUser, pendingRequests } = useAuth()
    const history = useHistory();

    function goToRequest(txnId, phn, name, date, sign) {
        history.push("/request?txnId=" + txnId + "&phn=" + phn + "&name=" + name + "&date=" + date + "&sign=" + sign)
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
                    <h3>Pending Requests</h3>
                    <hr/>
                    {/* <ul>
                        <li></li>
                    </ul> */}
                    {pendingRequests && pendingRequests.pending ? pendingRequests.pending.map((request) => (
                        <ul onClick={() => {
                            goToRequest(request.txnId, request.requestor_phn, request.requestor_name, request.request_date_time, request.signature)
                        }} style={{textDecoration: "none", listStyle: "none", cursor: "pointer", padding: "10px", borderRadius: "12px", border: "1px solid black"}}>
                            <li>Requested By: {request.requestor_phn}</li>
                        </ul>
                    )):<>No new requests</>}
                </div>
            </div>

        </div>
    )
}

export default Dashboard
