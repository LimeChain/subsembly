export namespace Utils {
    /**
     * @description Hex encode raw bytes
     * @param byteArray UInt8Array of bytes
     */
    export function toHexString(byteArray: Uint8Array): string {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }
}