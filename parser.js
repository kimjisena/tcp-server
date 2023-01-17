import { int2bytes, bytes2int, copy_buffer } from "./utils.js";
/**
 * AVL Data Packet (Sent over TCP)
 * 
 * preamble => 4 bytes
 * data_field_length => 4 bytes
 * data_field_length => 4 bytes
 * codec_id => 1 byte
 * number_of_data1 => 1 byte
 * avl_data => x bytes
 * number_of_data2 => 1 byte
 * crc16 => 4 bytes
 * 
 * AVL Data structure
 * 
 * timestamp => 8 bytes
 * priority => 1 byte
 * gps_element => 15 bytes
 * io_element => x bytes
 * 
 * GPS Element Data structure
 * 
 * longitude => 4 bytes (divide by 10000000 to get actual, check sign bit)
 * latitude => 4 bytes (divide 10000000 to get actual, check sign bit)
 * altitude => 2 bytes
 * angle => 2 bytes
 * satellites => 1 byte
 * speed => 2 bytes
 * 
 * IO Element Data structure
 * 
 * event_io_id => 1 byte
 * n_of_total_io => 1 byte
 * n1_of_n_byte_io => 1 byte
 * io_id => 1 byte
 * io_value => 1 byte
 */

/**
 * Parses byte 0 to byte 9
 * 
 * @param {Buffer} buffer The received packet
 * @returns {{preamble: number, data_field_length: number, codec_id: number, number_of_data1: number}}
 */
export function parse_header (buffer) {
    let preamble = bytes2int(copy_buffer(buffer, 0, 4));
    let data_field_length = bytes2int(copy_buffer(buffer, 4, 8));
    let codec_id = bytes2int(copy_buffer(buffer, 8, 9));
    let number_of_data1 = bytes2int(copy_buffer(buffer, 9, 10));

    return {
        preamble,
        data_field_length,
        codec_id,
        number_of_data1,
    };
}

/**
 * Parses bytes -5 up to -1 i.e (The last five bytes)
 * 
 * @param {Buffer} buffer The received packet
 * @returns {{number_of_data2: number, crc16: number}}
 */
export function parse_footer (buffer) {
    return {
        number_of_data2: '',
        crc16: '',
    };
}

/**
 * Parses byte 10 to 34
 * 
 * @param {Buffer} buffer The received packet
 * @returns {{
 *  timestamp: number, 
 *  priority: number, 
 *  gps_element: {
 *      longitude: number, 
 *      latitude: number,
 *      altitude: number,
 *      angle: number,
 *      satellites: number,
 *      speed: number
 *      }
 * }}
 */
export function parse_body (buffer) {
    let timestamp = bytes2int(copy_buffer(buffer, 10, 18));
    let priority = bytes2int(copy_buffer(buffer, 18, 19));
    let gps_element = {};

    // parse longitude and latitude
    if (buffer[19] === 0) {
        gps_element.longitude = bytes2int(copy_buffer(buffer, 19, 23)) / 10000000;
    } else {
        gps_element.longitude = bytes2int(copy_buffer(buffer, 19, 23)) / -10000000;
    }

    if (buffer[23] === 0) {
        gps_element.latitude = bytes2int(copy_buffer(buffer, 23, 27)) / 10000000;
    } else {
        gps_element.latitude = bytes2int(copy_buffer(buffer, 23, 27)) / -10000000;
    }

    gps_element.altitude = bytes2int(copy_buffer(buffer, 27, 29));
    gps_element.angle = bytes2int(copy_buffer(buffer, 29, 32));
    gps_element.satellites = bytes2int(copy_buffer(buffer, 32, 33));
    gps_element.speed = bytes2int(copy_buffer(buffer, 33, 35));

    return {
        timestamp,
        priority,
        gps_element,
    }
}


/**
 * Parses the first packet for imei information
 * 
 * @param {Buffer} buffer The received packet
 * @returns {{imei_length: number, imei: string}}
 */
export function parse_imei (buffer) {
    let imei_length = bytes2int(copy_buffer(buffer, 0, 2));
    let imei = Buffer.from([...copy_buffer(buffer, 2, buffer.length)]).toString('utf8');

    return {
        imei_length,
        imei,
    };
}
