# minecraft-client-ts

[![License Badge]][License]
[![Build Badge]][Build]
[![NPM Badge]][NPM]

A client for the Minecraft RCON protocol.

This library uses TypeScript, the Node.js runtime, Jest for testing, ESLint for linting, and CommonJS for compatibility.

## Library Usage

Compile JavaScript:

```
npm install --include=dev
npm run build
```

Use the client:

```ts
import Client from "minecraft-client-ts";
import { Message } from "minecraft-client-ts";
const client: Client = new Client("127.0.0.1", 25575);

// Client methods are Promises which reject(Error) on failure.
await client.connect();
await client.authenticate("mypassword");
let resp: Message = await client.sendCommand("seed"); // resp.body is "Seed: [-2474125574890692308]"
```

## Limitations

Response bodies over 4KB will be truncated.

## Starting a server for testing

```
docker pull itzg/minecraft-server
docker run --name=minecraft-server -p 25575:25575 -d -e EULA=TRUE itzg/minecraft-server
```

## Running Tests

Lint and autoformat the code:

```
npm run lint
npm run format
```

Run unit tests:

```
npm run build
npm run test
```

Run integration tests after starting the test server in Docker:

```
npm run build
npm run test_integ
```

## Reference

- https://wiki.vg/Rcon

[License]: https://www.gnu.org/licenses/gpl-3.0
[License Badge]: https://img.shields.io/badge/License-GPLv3-blue.svg
[Build]: https://github.com/willroberts/minecraft-client-ts/actions/workflows/build.yaml
[Build Badge]: https://github.com/willroberts/minecraft-client-ts/actions/workflows/build.yaml/badge.svg
[NPM]: https://www.npmjs.com/package/minecraft-client-ts
[NPM Badge]: https://img.shields.io/npm/v/minecraft-client-ts