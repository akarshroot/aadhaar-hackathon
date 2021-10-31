
function getLocation(oldAddress, newAddress, callback) {
    // const uri = "https://outpost.mapmyindia.com/api/security/v2.3.0/oauth/token"
    const uriOld = "http://api.positionstack.com/v1/forward?access_key=9351ef41630045fcd170234e727fb71a&query=" + oldAddress.house + " " + oldAddress.po + " " + oldAddress.vtc + " " + oldAddress.dist + " " + oldAddress.state + " " + oldAddress.country + " - " + oldAddress.pc
    const uriNew = "http://api.positionstack.com/v1/forward?access_key=9351ef41630045fcd170234e727fb71a&query=" + newAddress.house + " " + newAddress.po + " " + newAddress.vtc + " " + newAddress.dist + " " + newAddress.state + " " + newAddress.country + " - " + newAddress.pc

    let long1 = 0
    let lat1 = 0
    let long2 = 0
    let lat2 = 0
    const xhrOld = new XMLHttpRequest()
    xhrOld.open('GET', uriOld, true);
    xhrOld.setRequestHeader("Content-Type", "application/json")
    xhrOld.send();
    xhrOld.onreadystatechange = function () {
        try {
            long1 = this.response[0].lon
            lat1 = this.response[0].lat
        } catch (error) {

        }
    }

    const xhrNew = new XMLHttpRequest()
    xhrNew.open('GET', uriNew, true);
    xhrNew.setRequestHeader("Content-Type", "application/json")
    xhrNew.send();
    xhrNew.onreadystatechange = function () {
        try {
            long2 = this.response[0].lon
            lat2 = this.response[0].lat
        } catch (error) {

        }
    }
    try {
        const distance = getDistanceFromLatLonInKm(lat1, long1, lat2, long2)
        if (distance < 0.2) {
            callback(true)
            document.getElementById("done").style.display = "block"
        } else {
            callback(false)
            document.getElementById("rejected").style.display = "block"
        }
    } catch (error) {

    }
    callback(true)
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


export default getLocation
