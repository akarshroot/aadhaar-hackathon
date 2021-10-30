import React from 'react'
import './Navbar.css'
import aadhaarLogo from './assets/aadhaar_english_logo.svg'
import uidaiLogo from './assets/uidai_english_logo.svg'
import { useAuth } from './services/AuthContext'
import { useHistory } from 'react-router'

function Navbar() {
    const { currentUser, signout } = useAuth()
    const history = useHistory()
    function processLoginLogout() {
        currentUser ? signout() : goToLogin()
    }
    function goToLogin() {
        history.push("/login")
    }
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand text-capitalize" href="/"><img src={aadhaarLogo} alt="Aadhaar Logo" /></a>
                <a class="navbar-brand text-capitalize" href="/"><img src={uidaiLogo} alt="Aadhaar Logo" /></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Services
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#"></a></li>
                                <li><a class="dropdown-item" href="https://uidai.gov.in/">Info</a></li>
                                <li><hr class="dropdown-divider" /></li>
                                <li><a class="dropdown-item" href="https://economictimes.indiatimes.com/7-benefits-of-aadhaar-card/tomorrowmakersshow/69425509.cms">Adhar Imp</a></li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link text-capitalize" href="https://www.bankbazaar.com/aadhar-card/aadhaar-card-customer-care-toll-free-number.html">Contact us</a>
                        </li>
                        {currentUser ?

                            <li class="nav-item">
                                <button style={{ marginLeft: "15px", marginRight: "15px" }} id="login-logout-btn" class="btn btn-secondary btn-block" onClick={() => { history.push("/dashboard") }}>Dashboard</button>
                            </li>
                            :
                            <></>
                        }
                        <li class="nav-item">
                            <button id="login-logout-btn" class="btn btn-secondary btn-block" onClick={processLoginLogout}>{currentUser ? <>Logout</> : <>Log-In</>}</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
