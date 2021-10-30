import React, { useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import generateCaptcha from '../services/APIServices/GenerateCaptcha'
import generateOtp from '../services/APIServices/GenerateOtp'
import getData from '../services/APIServices/GetEKYC'
import { useAuth } from '../services/AuthContext'
import { useRequestorService } from '../services/RequestorService'
import aadhaarLogo from '../assets/aadhaar_english_logo.svg'
import uidaiLogo from '../assets/uidai_english_logo.svg'
import vigilenceBanner from '../assets/Aadhaar_Vigilence_banner.jpg'
import mainBanner from '../assets/banner1.jpg'
import './Home.css'

function Home() {
    useEffect(() => {
        // generateCaptcha()
    }, [])
    const { initLogging, signout } = useAuth()

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
        <>
            <header>
                <div id="carouselExampleFade" class="carousel slide carousel-fade" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src={vigilenceBanner} class="d-block w-100" />
                        </div>
                        <div class="carousel-item">
                            <img src={mainBanner} class="d-block w-100" />
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </header>

            <section class="main_heading my-5">
                <div class="text-center">
                    <a href="/login" style={{color: "black", textDecoration: "none"}}><h3 class="display-9 update-address-btn">Update Address</h3></a>
                    <hr class="w-25 mx-auto" />
                </div>
                <div class="text-center">
                    <h1 class="display-4">About Us</h1>
                    <hr class="w-25 mx-auto" />
                </div>
                <div class="container">
                    <div class="row my-5">
                        <div class="col-lg-6 col-md-6 col-12 col-xxl-6">
                            <figure>
                                <img src={uidaiLogo} alt="about images"
                                    class="img-fluid about_img" />
                            </figure>
                        </div>
                        <div class="col-lg-6 col-md-6 col-12 col-xxl-6 d-flex justify-content-cneter align-items-start flex-column">
                            <h1>Our Journey</h1>
                            <p>ADHAR: submission for theme-1 of the adhaar hackathon 2021 organized by UIDAI. This project aims
                                to create a fully electronic process for adress updation in adhaar.
                                blalalalalalalalalalalalallalalalalalajkjafjoifoisoirfihshifhishfihofhsirh</p>
                            <button type="button" class="btn btn-info" data-bs-toggle="tooltip" data-bs-placement="right" title="UIDAI"
                                href="">
                                <a href="https://www.bankbazaar.com/aadhar-card/benefits-of-aadhar-card-govt.html"></a>

                                Check More</button>
                        </div>
                    </div>

                </div>
            </section>

            <section class="main_heading my-5">

                <div class="text-center">
                    <h1 class="display-4">Adhaar,UIDAI</h1>
                    <hr class="w-25 mx-100 my-100" />
                </div>
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-12 col-xxl-4 mx-auto">
                            <div class="card mb-3" style={{ "max-width": "400px" }}>
                                <div class="row">
                                    <div class="col-md-4">
                                        <img src={aadhaarLogo} alt="about our services"
                                            class="img-fluid" />
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card-body">
                                            <h5 class="card-title">Card title</h5>
                                            <p class="card-text">
                                                blablablabalbalablabalbalbalabalablabalbalbalablalblbabbababbalbalablalalabalbaalbablbab</p>
                                            <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default Home
