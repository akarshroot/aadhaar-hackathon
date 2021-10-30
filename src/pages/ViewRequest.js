import React, { useEffect, useState } from 'react'
import { useAuth } from '../services/AuthContext'

function ViewRequest() {
    const { pendingRequests } = useAuth()
    const [txnId, setTxnId] = useState()
    const [phn, setPhn] = useState()
    const [name, setName] = useState()
    const [date, setDate] = useState()
    const [sign, setSign] = useState()
    const [viewCert, setViewCert] = useState(true)
    function parseISOString(s) {
        var b = s.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
      }
    function getTxnId() {
        setTxnId(window.location.href.split("txnId=")[1].split('&')[0])
        setPhn(window.location.href.split("phn=")[1].split('&')[0])
        setName(window.location.href.split("name=")[1].split('&')[0].replace("%20", " "))
        setDate(parseISOString(window.location.href.split("date=")[1].split('&')[0]))
        setSign(Buffer.from(window.location.href.split("sign=")[1], "base64"))
    }
    useEffect(() => {
        getTxnId()
    }, [])
    return (
        <div>
            <h2>Requested By: {name} ({phn})</h2>
            <h4>against transaction id: {txnId}</h4>
            <h4>at: {date && date.toUTCString()}</h4>
            <button type="start" className="btn-dashboard btn btn-secondary btn-block" onClick={()=> {setViewCert(!viewCert); document.getElementById("cert").value = sign}}>View Authenticity Certificate</button><br />
            <input style={{width: "300px", marginLeft: "50%", transform: "translateX(-50%)"}} type="textarea" id="cert" className="form-control" readOnly={true} hidden={viewCert} />
            <button type="start" className="btn-dashboard btn btn-primary btn-block">Accept</button><br />
            <button type="start" style={{backgroundColor: "#cc3300"}} className="btn-dashboard btn btn-primary btn-block">Reject</button><br />
            <button type="start" style={{backgroundColor: "#ffcc00", color: "black"}} className="btn-dashboard btn btn-primary btn-block">Mark Fraudulent</button><br />
        </div>
    )
}

export default ViewRequest
