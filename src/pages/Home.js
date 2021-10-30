import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import generateCaptcha from '../services/APIServices/GenerateCaptcha'
import generateOtp from '../services/APIServices/GenerateOtp'
import getData from '../services/APIServices/GetEKYC'
import { useAuth } from '../services/AuthContext'
import { useRequestorService } from '../services/RequestorService'

function Home() {
    useEffect(() => {
        generateCaptcha()
    }, [])
    const { initLogging } = useAuth()

    function submitOtpReq() {
        let captchaVal = document.getElementById("captchaVal").value
        let uid = document.getElementById("uid").value
        let captchaTxnId = document.getElementById("img").alt
        generateOtp(captchaTxnId, captchaVal, uid)
        generateCaptcha()

    }
    function submitOtp() {
        let otp = document.getElementById("otp").value
        let uid = document.getElementById("uid").value
        let txnId = document.getElementById("otptxnId").value
        // verifyOtp(txnId, uid, otp)
        getData(txnId, uid, otp, function () {
            initLogging()
        })
    }

    const { generateApprovalRequest } = useRequestorService()

    function sendRequest() {
        const requesteePhnNo = document.getElementById("requestee-phn").value
        generateApprovalRequest(requesteePhnNo)
    }

    return (
        <div>
            <Helmet><title>Home | Aadhaar Address Updation Portal</title></Helmet>
            Home Page :)
            <button onClick={() => { generateCaptcha() }}>POST</button>
            <br />
            <img id="img" src="" alt="" /><br />
            <label htmlFor="validate-captcha">validate-captcha: </label>
            <input id="captchaVal" name="validate-captcha" type="text" />
            <br />
            <label htmlFor="uid">uid: </label>
            <input id="uid" name="uid" type="text" />
            <input type="submit" className="submit" value="Submit" onClick={submitOtpReq} />
            <br />
            <br />
            <label htmlFor="otp">otp: </label>
            <input id="otp" name="otp" type="text" />
            <input id="otptxnId" type="hidden" />
            <input type="submit" className="submit" value="Submit" onClick={submitOtp} />
            <br />
            <br />
            <h1 id="name"></h1>
            <h3 id="err" style={{ color: "red" }}></h3>
            <br />
            <br />
            <br />
            <label htmlFor="requestee-phn">Introducer's Phone: </label>
            <input type="number" id="requestee-phn" />
            <input type="submit" onClick={sendRequest} value="Send Request" />
        </div>
    )
}

export default Home
