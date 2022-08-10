/// <reference types="node" />
import { Socket } from "net";
import { Message } from "./message";
export default class Client {
    host: string;
    port: number;
    timeout: number;
    conn: Socket;
    nextID: number;
    constructor(host: string, port: number, timeout?: number);
    connect(): Promise<void>;
    authenticate(password: string): Promise<Message>;
    sendCommand(body: string): Promise<Message>;
    close(): void;
    private sendMessage;
}
