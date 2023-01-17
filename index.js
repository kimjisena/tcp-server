import net from "net";
import { int2bytes, copy_buffer, bytes2int } from "./utils.js";
import { parse_imei, parse_header, parse_body } from "./parser.js";

const HOST = '127.0.0.1';
const PORT = 1861;

net.createServer(sock => {
    console.log(`[${new Date().toLocaleString()}] Connected to ${sock.remoteAddress}:${sock.remotePort}`);
    let payload = [];

    sock.on("data", (data) => {
        console.log(`[${new Date().toLocaleString()}] Received  data from ${sock.remoteAddress}:${sock.remotePort}`);

        if (data.length === 17) { // check if we've received the IMEI : \x00\xff359632107952878
            payload.push(parse_imei(data));
            sock.write(int2bytes(1));
        } else { // we're receiving data
            let parsedData = {};
            parsedData.header = parse_header(data);
            parsedData.body = parse_body(data);
            payload.push(parsedData);

            console.log(`[${new Date().toLocaleString()}] Payload: %o`, payload);
            payload = [payload[0]];

            // send the 10th byte back (number_of_data1) as acknowledgement
            let ack = new Uint8Array(4);
            ack.set(new Uint8Array([0, 0, 0]));
            ack.set(copy_buffer(data, 9, 10), 3);
            sock.write(ack);
        }
    });

    sock.on("close", (data) => {
        console.log(`[${new Date().toLocaleString()}] Connection closed by ${sock.remoteAddress}:${sock.remotePort}`);
        console.log(`[${new Date().toLocaleString()}] Payload: %o`, payload);
    });
}).listen(PORT, HOST);

console.log(`[${new Date().toLocaleString()}] Server is listening on ${HOST}:${PORT}`);
