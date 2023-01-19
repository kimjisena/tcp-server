import { copy_buffer, getCRC16 } from "./lib.js";
import { bytes2int } from "./utils.js";

/**
 * 
 * @param {Buffer} buffer 
 */

// GT06 PROTOCOL NUMBERS [byte 3]
const LOGIN_MSG_PACKET = 0X01;
const GPS_MSG_PACKET = 0X10;
const LBS_MSG_PACKET = 0X11;
const GPS_LBS_MSG_PACKET = 0X12;
const STATUS_INFO_PACKET = 0X13;
const SATELLITE_SNR_MSG_PACKET = 0X14;
const STRING_INFO_PACKET = 0X15;
const GPS_LBS_STATUS_INFO_MSG_PACKET = 0X16;
const LBS_QUERY_ADDR_INFO_BY_PHONE_NO = 0X17;
const LBS_EXT_MSG_PACKET = 0X18;
const LBS_STATUS_INFO_MSG_PACKET = 0X19;
const GPS_QUERY_ADDR_INFO_BY_PHONE_NUMBER = 0X1A;
const SERVER_SETTING_COMMAND_INFO = 0X80;
const SERVER_QUERYING_COMMAND_INFO = 0X81;

// JM-VG03 PROTOCOL NUMBERS
const PROBABLY_GPS_MSG_PACKET = 0X28;

function parse_login_msg (buffer) {
    let parsedData = {};

    const buildIMEI = (bytes) => {
        let IMEI = '';

        for (let i = 0; i < bytes.length; i++) {
            IMEI += bytes[i].toString(16);
        }
        return IMEI;
    };

    const buildTimeZone = (bytes) => {
        let byteStr = bytes2int(bytes).toString(2).padStart(16, '0');
        let sign = Number(byteStr[-4]) === 1 ? '-' : '+';
        let timezone = (parseInt(byteStr.slice(0, -4), 2)) / 100;

        if (Math.floor(timezone) === timezone) {
            return 'GMT' + sign + timezone.toString() + ':00';
        } else {
            timezone = timezone.toString().replace('.', ':');
            return 'GMT' + sign + timezone;
        }
    };

    parsedData.packet_length = buffer[2];
    parsedData.protocol_no = buffer[3];
    parsedData.imei = buildIMEI(copy_buffer(buffer, 4, 12));
    parsedData.type_id = bytes2int(copy_buffer(buffer, 12, 14));
    // parsedData.reserved_ext = bytes2int(copy_buffer(buffer, 14, 16));
    parsedData.timezone = buildTimeZone(copy_buffer(buffer, 14, 16));
    parsedData.info_serial_no = bytes2int(copy_buffer(buffer, 16, 18));
    parsedData.error_check = bytes2int(copy_buffer(buffer, 18, 20));

    return parsedData;
}

function parse_gps_msg (buffer) {
    let parsedData = {};

    const getDateObj = (bytes) => {
        let year = Number('20' + bytes[0].toString());
        let month = bytes[1];
        let date = bytes[2];
        let hours = bytes[3];
        let minutes = bytes[4];
        let seconds = bytes[5];

        let dateObj = new Date(year, month - 1, date, hours, minutes, seconds);

        return dateObj.toISOString();
    };

    parsedData.packet_length = buffer[2];
    parsedData.protocol_no = buffer[3];
    parsedData.datetime = getDateObj(copy_buffer(buffer, 4, 10));

    return parsedData;

}

function parse_probably_gps_msg (buffer) {
    let parsedData = {};
    
    const getDateObj = (bytes) => {
        let year = Number('20' + bytes[0].toString());
        let month = bytes[1];
        let date = bytes[2];
        let hours = bytes[3];
        let minutes = bytes[4];
        let seconds = bytes[5];

        let dateObj = new Date(year, month - 1, date, hours, minutes, seconds);

        return dateObj.toISOString();
    };

    const getGPSSatelliteInfo = (byte) => {
        let byteStr = byte.toString(2).padStart(8, '0');
        let gps_data_length = parseInt(byteStr.slice(0, 4), 2);
        let satellites = parseInt(byteStr.slice(4), 2);

        return {
            gps_data_length,
            satellites,
        }
    };

    const getLatitude = (buffer) => {
        let latitude = bytes2int(buffer) / (30000 * 60);
        return latitude;
    };

    const getLongitude = (buffer) => {
        let longitude = bytes2int(buffer) / (30000 * 60);
        return longitude;
    }

    parsedData.packet_length = buffer[2];
    parsedData.protocol_no = buffer[3];
    parsedData.datetime = getDateObj(copy_buffer(buffer, 4, 10));
    parsedData.gps_satellite_info = getGPSSatelliteInfo(buffer[10]);
    parsedData.latitude = getLatitude(copy_buffer(buffer, 11, 15));
    parsedData.longitude = getLongitude(copy_buffer(buffer, 15, 19));
    parsedData.speed = buffer[19];

    return parsedData;
}

function parse_status_info (buffer) {
    let parsedData = {};

    const getTermInfo = (byte) => {
        let byteStr = byte.toString(2).padStart(8, 0);
        let charging = Number(byteStr[-3]) === 1;
        let gps_tracking = Number(byteStr[-7]) === 1;
        let alarm_status = '';
        let alarm = parseInt(byteStr.slice(-6, -3), 2);

        switch (alarm) {
            case 0b111:
                alarm_status = 'Power OFF Alarm';
                break;
            case 0b110:
                alarm_status = 'Exit Geofence Alarm';
                break;
            case 0b101:
                alarm_status = 'Enter Geofence Alarm';
                break;
            case 0b100:
                alarm_status = 'SOS Alarm';
                break;
            case 0b011:
                alarm_status = 'Low Battery Alarm';
                break;
            case 0b010:
                alarm_status = 'Power ON Alarm';
                break;
            case 0b000:
                alarm_status = 'Normal';
                break;
            default:
                break;
        }

        return {
            alarm_status, 
            charging,
            gps_tracking,
        };
    };

    const getVoltageLevel = (byte) => {
        let voltageLevel = '';

        switch (byte) {
            case 0:
                voltageLevel = 'No Power';
                break;
            case 1:
                voltageLevel = 'Extremely Low Battery';
                break;
            case 2:
                voltageLevel = 'Very Low Battery';
                break;
            case 3:
                voltageLevel = 'Low Battery';
                break;
            case 4:
                voltageLevel = 'Medium';
                break;
            case 5:
                voltageLevel = 'High';
                break;
            case 6:
                voltageLevel = 'Very High';
                break;
            default:
                break;
        }

        return voltageLevel;

    };

    const getGSMSignalStrength = (byte) => {
        let signalStrength = '';

        switch(byte) {
            case 0X00:
                signalStrength = 'No Signal';
                break;
            case 0X01:
                signalStrength = 'Extremely Weak Signal';
                break;
            case 0X02:
                signalStrength = 'Very Weak Signal';
                break;
            case 0X03:
                signalStrength = 'Good Signal';
                break;
            case 0X04:
                signalStrength = 'Strong Signal';
                break;
            default:
                break;
        }

        return signalStrength;
    }

    parsedData.term_info = getTermInfo(buffer[4]);
    parsedData.voltage_level = getVoltageLevel(buffer[5]);
    parsedData.gsm_signal_strength = getGSMSignalStrength(buffer[6]);

    return parsedData;
}

/**
 * Parse a received packet
 * @param {Buffer} buffer The received buffer
 */
export function parse_packet (buffer) {
    let parsedData;
    let protocol = buffer[3];

    // parse data based on protocol number
    switch(protocol) {
        case LOGIN_MSG_PACKET:
            parsedData = parse_login_msg(buffer);
            break;
        case GPS_MSG_PACKET:
            parsedData = parse_gps_msg(buffer);
            break;
        case PROBABLY_GPS_MSG_PACKET:
            parsedData = parse_probably_gps_msg(buffer);
            break;
        case STATUS_INFO_PACKET:
            parsedData = parse_status_info(buffer);
            break;
        // case STRING_INFO:
        //     break;
        // case ALARM_DATA:
        //     break;
        // case GPS_QUERY_BY_PHONE_NUMBER:
        //     break;
        // case CMD_INFO_FROM_SERVER_TO_TERMINAL:
        //     break;
        default:
            parsedData = {};
            break;
    }

    return parsedData;
}
