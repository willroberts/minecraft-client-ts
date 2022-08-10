/// <reference types="node" />
import { Buffer } from "buffer";
export declare const HEADER_SIZE: number;
export declare enum MessageType {
    Response = 0,
    Command = 2,
    Authenticate = 3
}
export interface Message {
    id: number;
    type: number;
    size: number;
    body: string;
}
export declare function encodeMessage(msg: Message): Buffer;
export declare function decodeMessage(buf: Buffer): Message;
