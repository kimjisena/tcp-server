import net from "net";
import { parse_packet } from "./togree_parser.js";
import { getCRC16, getProtocol, int2bytes, merge_bytes, getACK } from "./lib.js";


const HOST = '127.0.0.1';
const PORT = 8499;
const URL = 'http://192.168.1.173:8800/api/gps_data';

net.createServer(sock => {
    console.log(`[${new Date().toLocaleString()}] Connected to ${sock.remoteAddress}:${sock.remotePort}`);

    sock.on("data", (data) => {
        console.log(`[${new Date().toLocaleString()}] Received  data from ${sock.remoteAddress}:${sock.remotePort}`);
        let parsedData = parse_packet(data);
        console.log("Parsed Data: %o", parsedData);

        let protocol = getProtocol(data);
        console.log('Protocol: ', protocol);
        if (protocol === 0x01) {
            let ack = getACK(data);
            console.log('Ack: %o', Buffer.from(ack));
            sock.write(ack);
        } else {
            console.log('Raw data: %o', data);
            let ack = getACK(data);
            console.log('Ack: %o', Buffer.from(ack));
            sock.write(ack);
        }
    });

    sock.on("close", (data) => {
        console.log(`[${new Date().toLocaleString()}] Connection closed by ${sock.remoteAddress}:${sock.remotePort}`);
    });
}).listen(PORT, HOST);

console.log(`[${new Date().toLocaleString()}] Server is listening on ${HOST}:${PORT}`);
