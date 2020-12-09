const { UInt8Array_ID, __newString, __getString, __retain, __release, __newArray,
     stringEncode, stringDecode, __getArray, cmpToDecimal
    } = require('./wasm-loader');

function encodeStr(str){
    let strPtr = __retain(__newString(str));
    const resPtr = stringEncode(strPtr);
    let resStr = __getArray(resPtr);
    __release(strPtr);
    __release(resPtr);
    return resStr;
}

function decodeStr(strBytes){
    const bytesPtr = __retain(__newArray(UInt8Array_ID, strBytes));
    const resPtr = stringDecode(bytesPtr);
    let resStr = __getString(resPtr);
    __release(bytesPtr);
    __release(resPtr);
    return resStr;
}

function decodeCompact(cmpBytes){
    const bytesPtr = __retain(__newArray(UInt8Array_ID, cmpBytes));
    const res = cmpToDecimal(bytesPtr);
    __release(bytesPtr);
    return res;
}

function hexToBytes(hex){
    hex = hex.slice(2);
    for (var bytes = [], c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
    return new Uint8Array(bytes);
}

function bytesToHex(bytes){
    for (var hex = [], i = 0; i < bytes.length; i++) {
        var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
        hex.push((current >>> 4).toString(16));
        hex.push((current & 0xF).toString(16));
    }
    return "0x".concat(hex.join(""));
}

console.log(bytesToHex(encodeStr(" period on default settings.")));
console.log(decodeStr(hexToBytes("0x48436f6d706163743c543a3a4d6f6d656e743e")))
console.log(decodeCompact(hexToBytes("0x3c")))
// 2454696d657374616d70