import dotenv from 'dotenv';
import net from "net";

import parse from './lib/parse.js';
import getView, { getACK } from './lib/helpers.js';
import { ParserReturnType } from './lib/parse.js';

// inject environment variables into process.env
dotenv.config();

export type PacketData = null | {
    imei: string,
    info: Record<string, string | number>,
};

const server = net.createServer(sock => {

    console.log(`[${new Date().toLocaleString()}] Connected to ${sock.remoteAddress}:${sock.remotePort}`);

    let data: ParserReturnType;

    sock.on("data", (packet) => {
        console.log(`[${new Date().toLocaleString()}] Received  data from ${sock.remoteAddress}:${sock.remotePort}`);
        // parse the packet to get the data
        console.log("Raw: %o", packet);

        data = parse(packet);

        console.log("Data: %o", data);

        let ack = getACK(packet);

        sock.write(ack);
    });

    sock.on("error", (err) => {
        console.log("A server error occurred. %o", err);
    });

    sock.on("close", (hadError) => {
        console.log(`[${new Date().toLocaleString()}] Connection closed by ${sock.remoteAddress}:${sock.remotePort}`);
    });
});

server.listen(Number(process.env.TCP_PORT), process.env.TCP_HOST, 8, () => {
    console.log(`[${new Date().toLocaleString()}] Server is listening on ${process.env.TCP_HOST}:${process.env.TCP_PORT}`);
});

