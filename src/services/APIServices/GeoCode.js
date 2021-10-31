function generateAccessToken() {
    const uri = "https://outpost.mapmyindia.com/api/security/v2.3.0/oauth/token"
    const body = {
        "grant_type": "client_credentials",
        "client_id": "33OkryzDZsJYaRJEzPBYTNPP84-u4kedE62x7mC8WOVlI6rYe-hK0fYO52BkK5vCRkYQ15qgVw9OXCfQD6vdMQ==",
        "client_secret": "lrFxI-iSEg9UjuTrvicXrhnCzbvb-zickYEcm6nJp1SQnyVHyCyNEY1KnfzqHJwEPbDnJE10pqySMJ6S5qfdrkz53voEuTQI",
    }
    const xhr = new XMLHttpRequest()
    xhr.open('POST', uri, true);
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(body));
    xhr.onload = function () {
        console.log(this.responseText);
    }
}

export default generateAccessToken
