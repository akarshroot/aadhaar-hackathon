import React, { useEffect } from 'react'
import generateCaptcha from '../services/APIServices/GenerateCaptcha'
import generateOtp from '../services/APIServices/GenerateOtp'
import getData from '../services/APIServices/GetEKYC'
import { useAuth } from '../services/AuthContext'
import './Login.css'

function Login() {
    const { initLogging, signout, initUserLoading, setInitUserLoading, currentUser } = useAuth()
    useEffect(() => {
        if (currentUser) {
            window.location.replace("/dashboard")
        }
        generateCaptcha()
    }, [])
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
            initLogging()
        })
    }
    return (
        <div id="intro" className="bg-image shadow-2-strong">
            <div className="mask d-flex align-items-center h-100" style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-xl-5 col-md-8">
                            <div className="bg-white rounded shadow-5-strong p-5">
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form1Example2">Enter you Aadhaar Number: </label>
                                    <input type="text" id="uid" placeholder="Aadhaar Number" className="form-control" autoComplete="new-uid"/><br />
                                    <div className="captcha-block">
                                        <input type="text" id="captcha-input" placeholder="Captcha" className="form-control" />
                                        <img id="captcha-img" src="" alt="" />
                                    </div>
                                    <button className="btn btn-secondary btn-block" style={{ width: "100px" }} onClick={generateCaptcha}>Reload</button>
                                </div>
                                <button type="start" className="btn btn-primary btn-block" onClick={submitOtpReq}>Get OTP</button>
                                <div id="post-otp-gen" className="post-otp-gen">
                                    <input type="hidden" id="otpTxnId" placeholder="" className="form-control" />
                                    <input type="number" id="otp-value" placeholder="OTP" className="form-control" />
                                    <button type="start" id="final-submit" className="btn btn-primary btn-block" onClick={submitOtp} disabled={initUserLoading}>{initUserLoading ? <>Please wait...</> : <>Submit</>}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
