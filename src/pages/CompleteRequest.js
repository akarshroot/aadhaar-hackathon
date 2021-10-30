import React, { useEffect, useState } from 'react'
import { decryptData } from '../services/Signature'
import './CompleteRequest.css'

function CompleteRequest() {
    const [pvtKey, setPvtKey] = useState()
    const [decrypted, setDecrypted] = useState(false)
    
    const [txnId, setTxnId] = useState()
    const [phn, setPhn] = useState()
    const [name, setName] = useState()
    const [date, setDate] = useState()
    const [data, setData] = useState()
    const [address, setAddress] = useState()
    
    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    }

    function readFile(callback) {
        var fr = new FileReader();
        fr.onload = function () {
            const res = fr.result.replace(new RegExp('\n', 'g'), "")
            setPvtKey(res)
            callback(res)
        }
        fr.readAsText(document.getElementById("pvt-key-file").files[0]);
    }

    async function decryptAddress(key) {
        const res = decryptData(data, key)
        setAddress(res)
        console.log(address);
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
                <input type="file" onChange={() => {readFile(decryptAddress)}} accept=".txt" name="pvt-key" id="pvt-key-file" /><br/>
                Full Address: {address}
            </div>
        </div>
    )
}

export default CompleteRequest
