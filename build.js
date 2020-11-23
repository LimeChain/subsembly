const fs = require("fs");
const WASM_FILE = fs.readFileSync(__dirname + "/build/runtime-optimized.wasm");
const byteArray = new Uint8Array(WASM_FILE);

const result = toHexString(byteArray);
fs.writeFile('./wasm-code', result, 'utf8', () => {
    console.info("Successfully created WASM Code file");
});

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}