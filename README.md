# JM-VG03/TK26 TCP Server Implementing The GT06 (Probably) GPS Communication Protocol
This is a simple TCP server acting as a gateway between the JM-VG03 vehicle tracker
and an HTTP endpoint.

The JM-VG03 devices seem to implement a variant of the GT06 protocol and as such this 
is still work in progress.

I have only managed to decode the login packet (protocol no: `0x01`) so far.

**Example: Login packet and it's decoded data**
```js
Raw: <Buffer 78 78 11 01 08 23 45 67 19 01 23 45 70 11 12 c1 00 12 f6 26 0d 0a>

Data: {
  protocol: 'login',
  data: {
    packetLength: 17,
    protocolNumber: 1,
    imei: '823456719012345',
    typeId: 3601,
    timezone: 'GMT+3:00',
    infoSerialNumber: 18,
    errorCheck: 15782
  }
}
```

## TO DO
- Decode the rest of packets
- Send the data to an HTTP endpoint
