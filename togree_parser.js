/**
 * GT06 Protocol - Data Packet Format
 * Total length of the packet is 10 + N bytes
 * =========================================================
 * start_bit => 2 bytes [0x78 0x78]
 * packet_length => 1 byte (5 + N)
 * protocol_no => 1 byte
 * info_content => N bytes
 * info_serial_n0 => 2 bytes
 * error_check => 2 bytes
 * stop_bit => 2 bytes [0x0D 0x0A]
 * 
 * Protocol Numbers
 * ==========================================================
 * login_msg => 0x01
 * location_data => 0x12
 * status_info => 0x13
 * string_info => 0x15
 * alarm_data => 0x16
 * gps_query_by_phone_number => 0x1A
 * cmd_info_from_server_to_terminal => 0x80
 * 
 * GPS Information
 * ==========================================================
 * datetime => 6 bytes (0xYY:0xMM:0xDD:0xhh:0xmm:0xss)
 * length_info:satellites => 1 byte (0xL:0xN)
 * latitude => 4 bytes (range 0-162000000) [divide by 30000 to get minutes]
 * longitude => 4 bytes (range 0-324000000) [divide by 30000 to get minutes]
 * speed => 1 byte (range 0-255 km/h)
 * status => 2 bytes
 * status bits expansion
 * ===> (bit 0 - bit 5)
 * bit 0, bit 1 => 0
 * bit 2 => realtime_gps (0 realtime positioning, 1 defferential positioning)
 * bit 3 => gps_has_been_positioned
 * bit 4 => longitude (o East, 1 West)
 * bit 5 => latitude (0 South, 1 North)
 * ===> (bit 6 - bit 15)
 * course from north (in degrees)
 * 
 * LBS Information
 * ==========================================================
 * mcc => 2 bytes (mobile country code)
 * mnc => 1 byte (mobile network code)
 * lac => 2 bytes (location area code)
 * cell_id => 3 bytes (cell tower id)
 * 
 * Status Information
 * ===========================================================
 * term_info_content => 1 byte
 * bit 0 => oil_and_electricity (1 disconnected, 0 connectd)
 * bit 1 => gps_tracking (1 on, 0 off)
 * ===> (bit 2 - bit 4)
 * 000 => normal
 * 001 => shock_alarm
 * 010 => power_cut_alarm
 * 011 => low_battery_alarm
 * 100 => sos
 * bit 5 => charge (1 on, 0 off)
 * bit 6 => acc (1 high, 0 low)
 * bit 7 => (1 activated, 0 deactivated)
 * voltage_level => 1 byte
 * 0 => NO_POWER
 * 1 => EXTREMELY_LOW_BATTERY
 * 2 => VERY_LOW_BATTERY
 * 3 => LOW_BATTERY
 * 4 => MEDIUM
 * 5 => HIGH
 * 6 => VERY_HIGH
 * gsm_signal_strength => 1 byte
 * 0 => NO_SIGNAL
 * 1 => EXTREMELY_WEAK_SIGNAL
 * 2 => VERY_WEAK_SIGNAL
 * 3 => GOOD_SIGNAL
 * 4 => STRONG_SIGNAL
 * alarm => 1 byte
 * 0 => normal
 * 1 => sos
 * 2 => power_cut_alarm
 * 3 => shock_alarm
 * 4 => fence_in_alarm
 * 5 => fence_out_alarm
 * language => 1 byte
 * 1 => chinese
 * 2 => english
 */

/**
 * 
 * @param {Buffer} buffer 
 */
export function parse_packet (buffer) {
    let preImei, imei, postImei;

}