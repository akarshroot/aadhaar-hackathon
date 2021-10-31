import React, { useEffect, useState } from 'react'
import getLocation from '../services/APIServices/GeoCode'
import getPostOffice from '../services/APIServices/PostOffice'
import { useRequestorService } from '../services/RequestorService'
import { decryptData } from '../services/Signature'
import './CompleteRequest.css'

function CompleteRequest() {
    const [pvtKey, setPvtKey] = useState()
    const [verified, setVerified] = useState(false)
    const [decrypted, setDecrypted] = useState(false)

    const [txnId, setTxnId] = useState()
    const [phn, setPhn] = useState()
    const [name, setName] = useState()
    const [date, setDate] = useState()
    const [data, setData] = useState()
    const [address, setAddress] = useState()

    const { completeRequest, rejectRequest } = useRequestorService()

    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    function readFile(callback) {
        try {
            var fr = new FileReader();
            fr.onload = function () {
                const res = fr.result.replace(new RegExp('\n', 'g'), "")
                console.log(res);
                setPvtKey(res)
                callback(res)
            }
            console.log(document.getElementById("pvt-key-file").files[0]);
            fr.readAsText(document.getElementById("pvt-key-file").files[0]);
        } catch (error) {
            console.error(error);
        }
    }

    function decryptAddress(key) {
        try {
            let res = decryptData(data, key)
            res = JSON.parse(res)
            getPostOffice(res, setAddress)
            console.log(address);
        } catch (error) {
            console.error(error);
        }
    }

    function verifyAddress() {
        const borrowed_address = address.house + " " + address.po + " " + address.vtc + " " + address.dist + " " + address.state + " " + address.country + " - " + address.pc
        const new_address = document.getElementById("new-house").value + " " + address.vtc + " " + address.dist + " " + address.state + " " + address.country + " - " + address.pc
        console.log(new_address);
        console.log("getting loc: " + address);
        getLocation(address, borrowed_address, setVerified)
        setTimeout(() => {
            document.getElementById("done").style.display = "block"
        }, 5000);
    }

    function submitChangeRequest() {
        completeRequest()
    }

    function rejectChangeRequest() {
        rejectRequest()
    }

    useEffect(() => {
        setTxnId(window.location.href.split("txnId=")[1].split('&')[0])
        setPhn(window.location.href.split("phn=")[1].split('&')[0])
        setName(window.location.href.split("name=")[1].split('&')[0].replace(new RegExp("%20", 'g'), " "))
        setDate(parseISOString(window.location.href.split("date=")[1].split('&')[0]))
        setData(window.location.href.split("data=")[1])
    }, [])

    return (
        <div className="complete-address-container">
            <h3>Congratulations, your introducer has approved your request to share his address.</h3>
            <hr class="w-25 mx-auto" />
            <p>To proceed with finalizing your new address,<br />
                please select the private key file provided to you at the time of creation of this request.</p>
            <div className="file-block">
                <label htmlFor="pvt-key">Select private key: </label><br />
                <span id="subtext">(default name: temporary_private_key_&#60;<i>your_phone_number</i>&#62;)</span><br />
                <input type="file" onChange={() => { readFile(decryptAddress) }} accept=".txt" name="pvt-key" id="pvt-key-file" /><br />
            </div>
            {
                address ?
                    <>
                        Full Borrowed Address:<br />
                        <textarea style={{ width: "fit-content", height: "100px" }} type="text" readOnly={true} id="new-full-address-user" value={address.house + " " + address.po + " " + address.vtc + " " + address.dist + " " + address.state + " " + address.country + " - " + address.pc} /><br />
                        <span id="subtext">Some minor modifications can be made to the borrowed address.</span><br />
                        <div className="post-decrypt">
                            <span id="subtext">Please make the required changes in the address.<br /> <div style={{ backgroundColor: "#ffcc00", padding: "5px", color: "black", margin: "15px" }}>Note: You're not allowed to change the city, district, state or country of the borrowed address.<br /> If you think the address does not resemble your new address consider asking a different introducer.</div> </span>
                            <div className="edit-address-sec-1">
                                <label className="form-label" htmlFor="form1Example2">House: </label>&nbsp;
                                <input type="text" id="new-house" className="form-control" autoComplete="new-house" />&nbsp;
                                <label className="form-label" htmlFor="form1Example2">City: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-vtc" readOnly={true} value={address.vtc} />&nbsp;
                                <label className="form-label" htmlFor="form1Example2">District: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-dist" readOnly={true} value={address.dist} />&nbsp;
                            </div>
                            <br />
                            <div className="edit-address-sec-2">
                                <label className="form-label" htmlFor="form1Example2">State: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-state" readOnly={true} value={address.state} />&nbsp;
                                <label className="form-label" htmlFor="form1Example2">Country: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-country" readOnly={true} value={address.country} />&nbsp;
                                <label className="form-label" htmlFor="form1Example2">Pincode: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-pc" readOnly={true} value={address.pc} /><br />
                            </div>
                            <div className="edit-address-sec-3">
                                <label className="form-label" htmlFor="form1Example2">Post Office: </label>&nbsp;
                                <input type="text" className="form-control" autoComplete="new-pc" readOnly={true} value={address.po} /><br />
                            </div>
                            <button type="submit" style={{ margin: "15px" }} className="btn btn-primary btn-block" onClick={verifyAddress}>Verify</button>
                        </div>
                    </>
                    :
                    <></>
            }
            <div id="done">
                The address has been verified and forwarded to UIDAI servers.<br />
                <button className="btn btn-primary btn-block" onClick={submitChangeRequest}>Click to complete process</button>
            </div>
            <div id="rejected">
                The address could not be verified and the request has been cancelled. Please re-initiate a request with some other introducer.<br />
                <button className="btn btn-primary btn-block" onClick={rejectChangeRequest}>Click to complete process</button>
            </div>
        </div >
    )
}

export default CompleteRequest
