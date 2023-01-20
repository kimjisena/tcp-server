export type ProtocolType = (
    'login' | 'gps' |
    'lbs' | 'gps_lbs'|
    'status' | 'snr' |
    'string' | 'gps_lbs_status' |
    'lbs_via_phone'| 'lbs_ext' | // or 0x18
    'lbs_status' | 'gps_via_phone' |
    'geofence_alarm' | 'gps_lbs_ext' |
    'sync' | 'set_cmd' | 'query_cmd' | 'unknown'
    );

const PROTOCOLS: Record<string, ProtocolType> = {
    '0xo1': 'login',
    '0x10': 'gps',
    '0x11': 'lbs',
    '0x12': 'gps_lbs',
    '0x13': 'status',
    '0x14': 'snr',
    '0x15': 'string',
    '0x96': 'gps_lbs_status',
    '0x97': 'lbs_via_phone',
    'ox98': 'lbs_ext', // or 0x18
    '0x99': 'lbs_status',
    '0x9a': 'gps_via_phone',
    '0x9b': 'geofence_alarm',
    '0x1e': 'gps_lbs_ext',
    '0x1f': 'sync',
    '0x80': 'set_cmd',
    '0x81': 'query_cmd',
};

export default PROTOCOLS;
