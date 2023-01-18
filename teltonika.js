import net from "net";
import { int2bytes, copy_buffer, bytes2int, send_to_http_server } from "./utils.js";
import { parse_imei, parse_header, parse_body } from "./teltonika_parser.js";

const HOST = '127.0.0.1';
const PORT = 8499;
const URL = 'http://192.168.1.173:8800/api/gps_data';

net.createServer(sock => {
    console.log(`[${new Date().toLocaleString()}] Connected to ${sock.remoteAddress}:${sock.remotePort}`);
    let payload = [];

    sock.on("data", (data) => {
        console.log(`[${new Date().toLocaleString()}] Received  data from ${sock.remoteAddress}:${sock.remotePort}`);

        if (data.length === 17) { // check if we've received the IMEI : \x00\x0f359632107952878
            payload.push(parse_imei(data));
            sock.write(int2bytes(1));
        } else { // we're receiving data
            let parsedData = {};
            parsedData.header = parse_header(data);
            parsedData.body = parse_body(data);
            payload.push(parsedData);

            console.log(`[${new Date().toLocaleString()}] Payload: %o`, payload);
            let response = send_to_http_server(parsedData, URL);
            response.then((res) => {

                if (res.status === 200) {
                    console.log(`Data was sent to ${URL} successfully.`);
                    payload = [payload[0]];
    
                    // send the 10th byte back (number_of_data1) as acknowledgement
                    let ack = new Uint8Array(4);
                    ack.set(new Uint8Array([0, 0, 0]));
                    ack.set(copy_buffer(data, 9, 10), 3);
                    sock.write(ack);
                } else {
                    console.log(`Data was not sent to ${URL}: HTTP ${response.status} ${response.statusText}`);
                    // we failed to POST that data, please do resend it
                    sock.write(new Uint8Array([0, 0, 0, 0]));
                }
            });
        }
    });

    sock.on("close", (data) => {
        console.log(`[${new Date().toLocaleString()}] Connection closed by ${sock.remoteAddress}:${sock.remotePort}`);
        console.log(`[${new Date().toLocaleString()}] Payload: %o`, payload);
    });
}).listen(PORT, HOST);

console.log(`[${new Date().toLocaleString()}] Server is listening on ${HOST}:${PORT}`);
