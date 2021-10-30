function generateCaptcha() {
    const uri = "https://stage1.uidai.gov.in/unifiedAppAuthService/api/v2/get/captcha"
    const body = {
        langCode: "en",
        captchaLength: "3",
        captchaType: "2"
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uri, true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
    xhr.send(JSON.stringify(body));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) changeCaptcha(xhr.responseText)
    }
}

function changeCaptcha(data) {
    data = JSON.parse(data)
    let txnID = data.captchaTxnId
    document.getElementById("captcha-img").src = "data:image/png;base64, " + data.captchaBase64String
    document.getElementById("captcha-img").alt = txnID
}

export default generateCaptcha
