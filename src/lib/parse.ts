import PROTOCOLS, { type ProtocolType } from "./protocols.js";
import { bytesToInt, getProtocol, sliceBuffer } from "./helpers.js";

export type ParserReturnType = {
    protocol: ProtocolType,
    data: Record<string, string | number>
}

type LoginPacketData = {
    packetLength?: number,
    protocolNumber?: number,
    imei?: string,
    typeId?: number,
    timezone?: string,
    infoSerialNumber?: number,
    errorCheck?: number,
}

export class Parser {
    view: Uint8Array;

    constructor(view: Uint8Array) {
        this.view = view;
    }

    // Parse login packet
    login (): ParserReturnType {
        let buffer = Buffer.from(this.view);

        let parsedData: LoginPacketData;
        
        const buildIMEI = (bytes: Uint8Array) => {
            let IMEI = '';
        
            for (let i = 0; i < bytes.length; i++) {
                IMEI += bytes[i].toString(16);
            }
            return IMEI;
        };
        
        const buildTimeZone = (bytes: Uint8Array) => {
            let byteStr = bytesToInt(bytes).toString(2).padStart(16, '0');
            let sign = Number(byteStr[-4]) === 1 ? '-' : '+';
            let timezone: string | number = (parseInt(byteStr.slice(0, -4), 2)) / 100;
        
            if (Math.floor(timezone) === timezone) {
                return 'GMT' + sign + timezone.toString() + ':00';
            } else {
                timezone = timezone.toString().replace('.', ':');
                return 'GMT' + sign + timezone;
            }
        };

        parsedData = {
            packetLength: buffer[2],
            protocolNumber: buffer[3],
            imei: buildIMEI(sliceBuffer(buffer, 4, 12)),
            typeId: bytesToInt(sliceBuffer(buffer, 12, 14)),
            timezone: buildTimeZone(sliceBuffer(buffer, 14, 16)),
            infoSerialNumber: bytesToInt(sliceBuffer(buffer, 16, 18)),
            errorCheck: bytesToInt(sliceBuffer(buffer, 18, 20)),
        }

        return {
            protocol: 'login',
            data: parsedData,
        };
    }

    // parse gps packet
    gps (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse lbs packet
    lbs (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse gps_lbs packet
    gps_lbs (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse status packet
    status (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse snr packet
    snr (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse a string packet
    string (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse gps_lbs_status packet
    gps_lbs_status (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse lbs_via_phone packet
    lbs_via_phone (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse lbs_ext packet
    lbs_ext (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse lbs_status packet
    lbs_status (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse gps_via_phone packet
    gps_via_phone (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse geofence_alarm packet
    geofence_alarm (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse gps_lbs_ext packet
    gps_lbs_ext (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse sync packet
    sync (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse set_cmd packet
    set_cmd (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }

    // Parse query_cmd packet
    query_cmd (): ParserReturnType {
        let msg = Buffer.from(this.view).toString('utf8');

        return {
            protocol: 'login',
            data: {
                msg,
            },
        };
    }
}


export default function parse (buffer: Buffer): ParserReturnType {
    let parser = new Parser(sliceBuffer(buffer));
    let protocol = PROTOCOLS[getProtocol(buffer)];

    switch(protocol) {
        case 'login':
            return parser[protocol]();
        default:
            return {
                protocol: 'unknown',
                data: {

                }
            }
    }
}
