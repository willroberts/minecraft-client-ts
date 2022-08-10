import {
  Message, MessageType, HEADER_SIZE, decodeMessage, encodeMessage,
} from "./message";

describe("encode message", () => {
  test("bytes should match fixtures", () => {
    const bytes: Buffer = encodeMessage({
      size: "seed".length + HEADER_SIZE,
      id: 1,
      type: MessageType.Command,
      body: "seed",
    });
    const expected: Buffer = Buffer.from([
      // Size: 14
      14, 0, 0, 0,
      // ID: 1
      1, 0, 0, 0,
      // Type: 2
      2, 0, 0, 0,
      // Body: "seed"
      115, 101, 101, 100,
      // Terminator
      0, 0,
    ]);
    expect(bytes).toEqual(expected);
  });
});

describe("decode message", () => {
  test("bytes should match fixtures", () => {
    const msg: Message = decodeMessage(Buffer.from([
      // Size: 38
      38, 0, 0, 0,
      // ID: 2
      2, 0, 0, 0,
      // Type: 0
      0, 0, 0, 0,
      // Body: "Seed: [-2474125574890692308]"
      83, 101, 101, 100, 58, 32, 91, 45, 50, 52, 55, 52, 49, 50,
      53, 53, 55, 52, 56, 57, 48, 54, 57, 50, 51, 48, 56, 93,
    ]));
    expect(msg.size).toBe(38);
    expect(msg.id).toBe(2);
    expect(msg.type).toBe(MessageType.Response);
    expect(msg.body).toBe("Seed: [-2474125574890692308]");
  });
});
