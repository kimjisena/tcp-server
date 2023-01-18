import net from "net";
import { int2bytes } from "./utils.js";


const HOST = '127.0.0.1';
const PORT = 8499;
const URL = 'http://192.168.1.173:8800/api/gps_data';

net.createServer(sock => {
    console.log(`[${new Date().toLocaleString()}] Connected to ${sock.remoteAddress}:${sock.remotePort}`);

    sock.on("data", (data) => {
        console.log(`[${new Date().toLocaleString()}] Received  data from ${sock.remoteAddress}:${sock.remotePort}`);
        console.log(`Data length: ${data.length}\n`);
        console.log(`Data:%o`, data);
        sock.write(int2bytes(1));
    });

    sock.on("close", (data) => {
        console.log(`[${new Date().toLocaleString()}] Connection closed by ${sock.remoteAddress}:${sock.remotePort}`);
    });
}).listen(PORT, HOST);

console.log(`[${new Date().toLocaleString()}] Server is listening on ${HOST}:${PORT}`);
