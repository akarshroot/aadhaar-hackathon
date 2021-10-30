import React, { useState } from 'react'
import { useAuth } from '../services/AuthContext'
import { useRequestorService } from '../services/RequestorService'
import './ChangeAddress.css'

function ChangeAddress() {
    const { generateApprovalRequest } = useRequestorService()
    const {userPhn} = useAuth()
    const [keyLoader, setKeyLoader] = useState(false)

    function setStep2() {
        document.getElementById("step2").style.display = "block"
    }
    async function sendRequest() {
        setKeyLoader(true)
        const requesteePhnNo = document.getElementById("introducer-phn").value
        const userPhn = document.getElementById("user-phn").value
        await generateApprovalRequest(requesteePhnNo, userPhn)
        setKeyLoader(false)
    }
    return (
        <div>
            <div class="step1">
                <label htmlFor="docs">Do you have some supporting documents to update your address? (these include passport, bills etc.)</label><br/>
                <input onChange={setStep2} type="radio" name="docs" id="yes" />
                <span> Yes </span><br/>
                <input onChange={setStep2} type="radio" name="docs" id="no" />
                <span> No </span>
            </div>
            <hr class="w-25 mx-auto" />
            <div class="step2" id="step2">
                <label htmlFor="introducer-phn">Enter your registered mobile number: </label><br/>
                <input type="number" name="user-phn" id="user-phn" className="form-control" autoComplete="new-phn" />
                <label htmlFor="introducer-phn">Enter an introducer's registered mobile number: </label><br/>
                <span id="subtext">This might be your landlord or some neighbour who agrees to share his/her address.</span>
                <input type="number" name="introducer-phn" id="introducer-phn" className="form-control" autoComplete="new-introducer-phn" />
                <button type="start" id="final-submit" className="btn btn-primary btn-block" onClick={sendRequest} disabled={keyLoader}>{keyLoader?<>Please wait...</>:<>Submit Request</>}</button>
                <p id="userkey"></p>
            </div>
        </div>
    )
}

export default ChangeAddress
