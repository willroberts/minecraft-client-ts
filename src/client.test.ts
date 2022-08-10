import Client from "./client";

const TEST_HOST: string = "127.0.0.1";
const TEST_PORT: number = 25575;
const TEST_INVALID_PORT: number = 25576;

describe("integration test the client", () => {
  test("should fail to connect", async () => {
    const client: Client = new Client(TEST_HOST, TEST_INVALID_PORT);
    await expect(client.connect()).rejects.toHaveProperty("code", "ECONNREFUSED");
  });

  test("should connect", async () => {
    const client: Client = new Client(TEST_HOST, TEST_PORT);
    try {
      await expect(client.connect()).resolves;
    } finally {
      client.close();
    }
  });

  test("should fail to authenticate", async () => {
    const client: Client = new Client(TEST_HOST, TEST_PORT);
    try {
      await expect(client.connect()).resolves;
      await expect(client.authenticate("notminecraft")).rejects.toEqual(new Error("invalid password"));
    } finally {
      client.close();
    }
  });

  test("should authenticate", async () => {
    const client: Client = new Client(TEST_HOST, TEST_PORT);
    try {
      await expect(client.connect()).resolves;
      await expect(client.authenticate("minecraft")).resolves.toHaveProperty("id", 0); // Matches request ID.
    } finally {
      client.close();
    }
  });

  test("should receive command response", async () => {
    const client: Client = new Client(TEST_HOST, TEST_PORT);
    try {
      await expect(client.connect()).resolves;
      await expect(client.authenticate("minecraft")).resolves.toHaveProperty("id", 0); // Matches request ID.
      await expect(client.sendCommand("seed")).resolves.toHaveProperty("type", 0); // MessageType.Response
    } finally {
      client.close();
    }
  });
});
