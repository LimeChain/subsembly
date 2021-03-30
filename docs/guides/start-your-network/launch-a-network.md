# Launch a Network

### Introduction

Before we generate our keys and edit our chain spec files, we need to launch a network for two participants: **Alice** and **Bob**.

### Alice

The prerequisite for this step is a compiled runtime and generated chain spec file. Refer to [**Development**](../../development/development.md) section or to [previous](../create-your-first-subsembly-runtime/) guide on how to do it.

Alice runs the following commands inside the **Subsembly** project root folder:

```text
make run-node NAME=node01 PORT=30333 WS-PORT=9944 RPC-PORT=9933 spec=raw-chain-spec.json OTHER=--validator
```

What do those flags represent?

```text
NAME= Specifies the name of your Node
PORT = Specifies the port that your node will listen for p2p traffic on
WS-PORT = Specifies the port that your node will listen for p2p traffic on
RPC-PORT = Specifies the port that your node will listen for incoming RPC traffic on
spec = Specifies path to the raw chain spec file
OTHER = Specifies additional flags/options to provide to the node. In this case, we want our node to be validator
```

More details about the flags and other options for the node, can be explored with the following command:

```text
make run-node help=1
```

After running the last command, you should see the following output:

```text
Mar 25 16:11:41.565  INFO Substrate Node    
Mar 25 16:11:41.565  INFO ✌️  version 2.0.0-unknown-x86_64-linux-gnu    
Mar 25 16:11:41.565  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
Mar 25 16:11:41.565  INFO 📋 Chain specification: Local Testnet    
Mar 25 16:11:41.565  INFO 🏷  Node name: noisy-channel-3350    
Mar 25 16:11:41.565  INFO 👤 Role: AUTHORITY    
Mar 25 16:11:41.566  INFO 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
Mar 25 16:11:41.566  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)    
Mar 25 16:11:41.701  INFO 🔨 Initializing Genesis block/state (state: 0x54d1…dab9, header-hash: 0x1bef…c190)    
Mar 25 16:11:41.725  INFO ⏱  Loaded block-time = 5000 milliseconds from genesis on first-launch    
Mar 25 16:11:41.725  WARN Using default protocol ID "sup" because none is configured in the chain specs    
Mar 25 16:11:41.726  INFO 🏷  Local node identity is: 12D3KooWGtgEa8AuxLMnuKf71qE1bPb2nGKXbgmyjhC5G1w7Yrrf (legacy representation: 12D3KooWGtgEa8AuxLMnuKf71qE1bPb2nGKXbgmyjhC5G1w7Yrrf)    
Mar 25 16:11:41.730  INFO 📦 Highest known block at #0    
Mar 25 16:11:41.731  INFO 〽️ Prometheus server started at 127.0.0.1:9615    
Mar 25 16:11:41.733  INFO Listening for new connections on 127.0.0.1:9944.    
Mar 25 16:11:46.736  INFO 💤 Idle (0 peers), best: #0 (0x1bef…c190), finalized #0 (0x1bef…c190), ⬇ 0 ⬆ 0    
Mar 25 16:11:51.707  INFO 💤 Idle (0 peers), best: #0 (0x1bef…c190), finalized #0 (0x1bef…c190), ⬇ 0 ⬆ 0    
```

### Connect to PolkadotJs

