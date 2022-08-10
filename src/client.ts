import { createConnection, Socket } from "net";
import {
  decodeMessage, encodeMessage, HEADER_SIZE, Message, MessageType,
} from "./message";

const DEFAULT_TIMEOUT = 1000; // Milliseconds.

export default class Client {
  host: string;
  port: number;
  timeout: number;
  conn!: Socket;
  nextID: number = 0;

  constructor(host: string, port: number, timeout?: number) {
    this.host = host;
    this.port = port;
    if (timeout !== undefined) {
      this.timeout = timeout;
    } else {
      this.timeout = DEFAULT_TIMEOUT;
    }
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      function errorListener(e: Error): void { reject(e); }

      const conn = createConnection({
        host: this.host,
        port: this.port,
      }, () => {
        conn.removeListener("error", errorListener);
        resolve();
      });

      conn.on("error", errorListener);
      conn.setTimeout(this.timeout);
      this.conn = conn;
    });
  }

  async authenticate(password: string): Promise<Message> {
    return this.sendMessage(MessageType.Authenticate, password);
  }

  async sendCommand(body: string): Promise<Message> {
    return this.sendMessage(MessageType.Command, body);
  }

  close(): void {
    if (this.conn !== null) {
      this.conn.removeAllListeners();
      this.conn.destroy();
    }
  }

  // Underlying mechanism for TCP communication, used by authenticate() and sendCommand().
  private async sendMessage(type: number, body: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      if (this.conn === null) { reject(new Error("client is not connected; call connect()")); }

      // Serialize the request.
      const req: Message = {
        size: body.length + HEADER_SIZE,
        id: this.nextID,
        type,
        body,
      };
      this.nextID += 1;
      const bytes: Buffer = encodeMessage(req);

      // Attach listeners.
      this.conn.on("error", (e: Error): void => {
        this.conn.removeAllListeners();
        reject(e);
      });
      this.conn.on("timeout", (): void => {
        this.conn.removeAllListeners();
        reject(new Error("connection timed out"));
      });
      this.conn.on("data", (data: Buffer): void => {
        const resp: Message = decodeMessage(data);

        // Special handling for authentication.
        if (resp.type === MessageType.Command && resp.id === -1) {
          reject(new Error("invalid password"));
        }

        this.conn.removeAllListeners();
        resolve(resp);
      });

      // Send the request.
      this.conn.write(bytes);
    });
  }
}
