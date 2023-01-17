/**
 * Returns a slice of a buffer
 * @param {Buffer} buffer The received buffer
 * @param {number} from Start index (inclusive)
 * @param {number} to End index (exclusive)
 * @returns {Uint8Array} The copied buffer
 */

export function copy_buffer (buffer, from, to) {
    let slice = Uint8Array.prototype.slice.call(buffer, from, to);
    return slice;
}

/**
 * Converts a number to an array of bytes
 * @param {number} num Number to be converted to bytes
 * @returns {Uint8Array} The bytes array
 */
export function int2bytes(num) {
    if (!num) return new Uint8Array([0]);
    const a = []
    a.unshift(num & 255)
    while (num >= 256) {
      num = num >>> 8
      a.unshift(num & 255);
    }
    return new Uint8Array(a);
}

/**
 * Convert an array of bytes to number
 * @param {Uint8Array} bytes The bytes to convert to number
 * @returns {number} The number
 */
export function bytes2int (bytes) {
    let byteString = '';
    for (let byte of bytes) {
        byteString += byte.toString(2);
    }
    return parseInt(byteString, 2);
}
