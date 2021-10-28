import xml2js from 'xml2js'

function getName(txnID, uid, otp) {
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
        if (xhr.readyState === 4 && xhr.status === 200) setName(xhr.responseText)
    }
}

function setName(data) {
    console.log(data);
    let check = data.split('"status":"')[1].split('","eKycString"')[0]
    console.log("check: " + check);
    data = JSON.parse(data)
    data = data.eKycString
    data = xml2js.parseString(data, function (err, res) {
        console.log(res);
        if(check == "Y" || check == "y")
            document.getElementById("name").innerHTML = "Welcome " + res.KycRes.UidData[0].Poi[0].$.name
        else
            document.getElementById("err").innerHTML = "Error: " + res.Resp.$.err

    })
}

export default getName
