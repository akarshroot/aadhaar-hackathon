import { v4 as uuidv4 } from 'uuid';

function generateOtp(captchaTxnId, captchaValue, uid) {
    const uri = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/generate/aadhaar/otp"
    const txnId = uuidv4()
    const finalTxn = "MYAADHAAR:" + txnId
    const body = {
        uidNumber: uid,
        captchaTxnId: captchaTxnId,
        captchaValue: captchaValue,
        transactionId: finalTxn
    }
    console.log(body);
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uri, true);
    xhr.setRequestHeader("x-request-id", txnId)
    xhr.setRequestHeader("appid", "MYAADHAAR")
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Accept-Language", "en_in")
    xhr.send(JSON.stringify(body));
    xhr.onload = function () {
        console.log(this.responseText);
        setTxnId(this.responseText, txnId)
    }
}

function setTxnId(data) {
    if (data) {
        data = JSON.parse(data)
        if (data.status == "Failure") {
            alert(data.message)
            document.getElementById("captcha-input").value = ""
            return
        }
        document.getElementById("otpTxnId").value = data.txnId
        document.getElementById("post-otp-gen").style.display = "block"
        document.getElementById("uid").readonly = true
    }
}

export default generateOtp
