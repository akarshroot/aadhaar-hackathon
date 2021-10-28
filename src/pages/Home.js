import React, { useEffect } from 'react'
import Helmet from 'react-helmet'
import generateCaptcha from '../services/APIServices/GenerateCaptcha'
import generateOtp from '../services/APIServices/GenerateOtp'
import getName from '../services/APIServices/GetEKYC'
import verifyOtp from '../services/APIServices/VerifyOtp'
import xml2js from 'xml2js'

function Home() {
    useEffect(() => {
            generateCaptcha()
    }, [])
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
        getName(txnId, uid, otp)

    }

    return (
        <div>
            <Helmet><title>Home | Aadhaar Address Updation Portal</title></Helmet>
            Home Page :)
            <button onClick={() => {generateCaptcha()}}>POST</button>
            <br/>
            <img id="img" src="" alt="" /><br/>
            <label htmlFor="validate-captcha">validate-captcha: </label>
            <input id="captchaVal" name="validate-captcha" type="text"/>
            <br/>
            <label htmlFor="uid">uid: </label>
            <input id="uid" name="uid" type="text"/>
            <input type="submit" className="submit" value="Submit" onClick={submitOtpReq} />
            <br/>
            <br/>
            <label htmlFor="otp">otp: </label>
            <input id="otp" name="otp" type="text"/>
            <input id="otptxnId" type="hidden"/>
            <input type="submit" className="submit" value="Submit" onClick={submitOtp} />
            <br/>
            <br/>
            <h1 id="name"></h1>
            <h3 id="err" style={{color: "red"}}></h3>
        </div>
    )
}

export default Home
