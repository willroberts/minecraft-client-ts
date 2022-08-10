import { Buffer } from "buffer";

export const HEADER_SIZE: number = 10; // 4-byte ID, 4-byte type, 2-byte terminator.

export enum MessageType {
    Response = 0,
    Command = 2,
    Authenticate = 3
}

export interface Message {
    id: number
    type: number
    size: number
    body: string
}

export function encodeMessage(msg: Message): Buffer {
  // Message size does not include the 32-bit size itself, so add 4.
  const buf: Buffer = Buffer.alloc(msg.size + 4);
  buf.writeInt32LE(msg.size, 0);
  buf.writeInt32LE(msg.id, 4);
  buf.writeInt32LE(msg.type, 8);
  buf.write(msg.body, 12);
  buf.writeInt8(0, 12 + msg.body.length);
  buf.writeInt8(0, 13 + msg.body.length);
  return buf;
}

export function decodeMessage(buf: Buffer): Message {
  return {
    size: buf.readInt32LE(0),
    id: buf.readInt32LE(4),
    type: buf.readInt32LE(8),
    body: buf.toString("utf-8", 12),
  };
}
