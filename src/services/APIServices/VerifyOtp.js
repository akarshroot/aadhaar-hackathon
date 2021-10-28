import getName from "./GetEKYC";

function verifyOtp(txnID, uid, otp) {
    const uri = "https://stage1.uidai.gov.in/onlineekyc/getAuth/"
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
        if (xhr.readyState === 4 && xhr.status === 200) func(xhr.responseText)
    }
}

function func(data, uid, txn, otp) {
    console.log(data);
    data = JSON.parse(data)
    alert(data.status)
    if(data.status == "y")
        getName(txn, uid, otp)
}

export default verifyOtp
