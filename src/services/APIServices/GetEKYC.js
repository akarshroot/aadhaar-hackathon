import xml2js from 'xml2js'

function getData(txnID, uid, otp, callback) {
    const uri = "https://stage1.uidai.gov.in/onlineekyc/getEkyc/"
    const body = {
        uid: uid,
        txnId: txnID,
        otp: otp
       }
    console.log(txnID);
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uri, true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) setData(xhr.responseText, callback)
    }
}

function setData(data, callback) {
    console.log(data);
    let check = JSON.parse(data)
    console.log("check: " + check);
    data = JSON.parse(data)
    data = data.eKycString
    data = xml2js.parseString(data, function (err, res) {
        console.log(check);
        console.log(res);
        if(check.status == "Y" || check.status == "y")
        {
            const name = res.KycRes.UidData[0].Poi[0].$.name
            const phn = res.KycRes.UidData[0].Poi[0].$.phone
            sessionStorage.setItem("name", name)
            sessionStorage.setItem("phone-number", phn)
            console.log("session data is set");
        }  
        else
            alert(check.errCode)

    })
    callback()
}

export default getData
