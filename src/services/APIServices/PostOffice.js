function getPostOffice(address, callback) {
    console.log(address);
    const uri = "https://api.postalpincode.in/pincode/" + address.pc
    const xhr = new XMLHttpRequest()
    xhr.open('GET', uri, true);
    xhr.send();
    xhr.onload = function () {
        setPostOffice(xhr.responseText, address, callback)
    }
}

function setPostOffice(res, address, callback) {
    res = JSON.parse(res)
    console.log(res);
    address["po"] = res[0].PostOffice[0].Name
    callback(address)
}

export default getPostOffice
