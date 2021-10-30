import React, { useEffect, useState } from 'react'
import generateCaptcha from '../services/APIServices/GenerateCaptcha'
import generateOtp from '../services/APIServices/GenerateOtp'
import getData from '../services/APIServices/GetEKYC'
import { useAuth } from '../services/AuthContext'
import { useRequesteeService } from '../services/RequesteeService'
import { encryptData } from '../services/Signature'

function ViewRequest() {
    const { pendingRequests } = useAuth()
    const [txnId, setTxnId] = useState()
    const [phn, setPhn] = useState()
    const [name, setName] = useState()
    const [date, setDate] = useState()
    const [sign, setSign] = useState()
    const [viewCert, setViewCert] = useState(true)
    const { grantConsent, rejectConsent, markFraud } = useRequesteeService()
    const { initLogging, signout, initUserLoading, setInitUserLoading, currentUser } = useAuth()
    const [displayAllowConsent, setDisplayAllowConsent] = useState(false)
    const [userAddress, setUserAddress] = useState()

    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }
    function getTxnId() {
        setTxnId(window.location.href.split("txnId=")[1].split('&')[0])
        setPhn(window.location.href.split("phn=")[1].split('&')[0])
        setName(window.location.href.split("name=")[1].split('&')[0].replace(new RegExp("%20", 'g'), " "))
        setDate(parseISOString(window.location.href.split("date=")[1].split('&')[0]))
        setSign(Buffer.from(window.location.href.split("sign=")[1], "base64"))
    }

    function grantConsentLocal() {
        console.log("access granted for address: " + userAddress);
        const signedData = encryptData(userAddress, sign)
        grantConsent(signedData, phn, txnId)
    }

    function rejectConsentLocal() {
        rejectConsent(phn, txnId)
    }

    function markFraudLocal() {

    }
    function submitOtpReq() {
        let captchaVal = document.getElementById("captcha-input").value
        let uid = document.getElementById("uid").value
        let captchaTxnId = document.getElementById("captcha-img").alt
        generateOtp(captchaTxnId, captchaVal, uid)
        generateCaptcha()
    }
    function submitOtp() {
        setInitUserLoading(true)
        let otp = document.getElementById("otp-value").value
        let uid = document.getElementById("uid").value
        let txnId = document.getElementById("otpTxnId").value
        // verifyOtp(txnId, uid, otp)
        getData(txnId, uid, otp, function () {
            setInitUserLoading(false)
            const data = JSON.parse(sessionStorage.getItem("address"))
            setUserAddress(data)
            document.getElementById("final-address-introducer").value = (data.house + " " + data.vtc + " "  + data.dist + " "  + data.state + " "  + data.country + " "  + data.pc)
            setDisplayAllowConsent(true)
        })
    }

    useEffect(() => {
        getTxnId()
        generateCaptcha()
    }, [])
    return (
        <div>
            <h2>Requested By: {name} ({phn})</h2>
            <h4>against transaction id: {txnId}</h4>
            <h4>at: {date && date.toUTCString()}</h4>
            <button type="start" className="btn-dashboard btn btn-secondary btn-block" onClick={() => { setViewCert(!viewCert); document.getElementById("cert").value = sign }}>View Authenticity Certificate</button><br />
            <input style={{ width: "300px", marginLeft: "50%", transform: "translateX(-50%)" }} type="textarea" id="cert" className="form-control" readOnly={true} hidden={viewCert} />
            <div className="bg-white rounded shadow-5-strong p-5">
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form1Example2">Enter you Aadhaar Number: </label><br/>
                    <span id="subtext">As this is a sensitive operation it requires re-authentication.<br /> By clicking "Grant Consent", agree to share your address with the above mentioned requestor.</span>
                    <input style={{width: "200px", marginLeft: "50%", transform: "translateX(-50%)"}} type="text" id="uid" placeholder="Aadhaar Number" className="form-control" autoComplete="new-uid" /><br />
                    <div style={{width: "200px"}} className="captcha-block">
                        <input type="text" id="captcha-input" placeholder="Captcha" className="form-control" />
                        <img id="captcha-img" src="" alt="" />
                    </div>
                    <br/>
                    <button className="btn btn-secondary btn-block" style={{ width: "100px" }} onClick={generateCaptcha}>Reload</button>
                </div>
                <button type="start" className="btn btn-primary btn-block" onClick={submitOtpReq}>Get OTP</button>
                <div style={{width: "200px", marginLeft: "50%", transform: "translateX(-50%)"}} id="post-otp-gen" className="post-otp-gen">
                    <input type="hidden" id="otpTxnId" placeholder="" className="form-control" />
                    <input style={{width: "200px", marginLeft: "50%", transform: "translateX(-50%)"}}  type="number" id="otp-value" placeholder="OTP" className="form-control" />
                    <button type="start" id="final-submit" className="btn btn-primary btn-block" onClick={submitOtp} disabled={initUserLoading}>{initUserLoading ? <>Please wait...</> : <>Submit</>}</button>
                </div>
            </div>
            <input type="text" readOnly={true} id="final-address-introducer" hidden={!displayAllowConsent}/>
            <button type="start" className="btn-dashboard btn btn-primary btn-block" onClick={grantConsentLocal} hidden={!displayAllowConsent}>Grant Consent</button><br />
            <button type="start" style={{ backgroundColor: "#cc3300" }} className="btn-dashboard btn btn-primary btn-block" onClick={rejectConsentLocal}>Reject</button><br />
            <span id="subtext">Reject operation does not require re-authentication</span><br />
            <button type="start" style={{ backgroundColor: "#ffcc00", color: "black" }} className="btn-dashboard btn btn-primary btn-block">Mark Fraudulent</button><br />
            <span id="subtext">Mark Fraudulent operation does not require re-authentication</span><br />

        </div>
    )
}

export default ViewRequest
