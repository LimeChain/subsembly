# Launch the Third Node

### Modify the Chain Spec

We have already done this step in the last [guide](../create-your-first-subsembly-runtime/) and in the [Development](../../development/development.md) section. So the default content of **`chain-spec.json`** looks like this:

```text
"runtime": {
      "system": {
        "code": "0x"
      },
      "aura": {
        "authorities": [
          "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs",
          "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
        ]
      }
    }
    //-- snip --
```

**`aura.authorities`** property in the chain spec defines the list of public keys or authorities that have the right to produce blocks. And there we add our newly generated address from the last step:

```text
"runtime": {
      "system": {
        "code": "0x"
      },
      "aura": {
        "authorities": [
          "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs",
          "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
          "5HQxe4hw4bZm5uK4kUeq3Wkvw7Uem7NesYjB53BjAUizNZN6"
        ]
      }
    }
    //-- snip --
```

And don't forget to convert your modified chain spec into raw:

```text
subsembly spec --src=./chain-spec.json
```

### Restart the Nodes

Every node in one network should have the common raw chain specification file. Since we have updated our chain spec file, we will need to restart the nodes of Alice and Bob with the new one. Quit the nodes, if you are running them and restart them with the same [commands](launch-a-network.md).

### Start Custom Node

To launch the third node with our own generated keys, run this command:

```text
make run-node \
PORT=30335 \
WS-PORT=9946 \
RPC-PORT=9935 \
spec=raw-chain-spec.json \
NAME=node03 \
-- --validator \
--bootnodes /ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp /ip4/172.17.0.3/tcp/30334/p2p/12D3KooWE2e8yccz2skbaKmHnizcgY2vGyuUBehXbDnYok3Ze59A
```

You can connect and interact with the node using PolkadotJs similar to other nodes. And you should see output similar to this:

```text
Apr 01 08:07:04.405  INFO Substrate Node    
Apr 01 08:07:04.405  INFO ✌️  version 2.0.0-unknown-x86_64-linux-gnu    
Apr 01 08:07:04.405  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
Apr 01 08:07:04.405  INFO 📋 Chain specification: Local Testnet    
Apr 01 08:07:04.405  INFO 🏷  Node name: node03    
Apr 01 08:07:04.405  INFO 👤 Role: FULL    
Apr 01 08:07:04.405  INFO 💾 Database: RocksDb at /tmp/node03/chains/local_testnet/db    
Apr 01 08:07:04.405  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)    
Apr 01 08:07:04.540  INFO 🔨 Initializing Genesis block/state (state: 0xb60f…8962, header-hash: 0x37c1…c164)    
Apr 01 08:07:04.566  INFO ⏱  Loaded block-time = 5000 milliseconds from genesis on first-launch    
Apr 01 08:07:04.567  WARN Using default protocol ID "sup" because none is configured in the chain specs    
Apr 01 08:07:04.567  INFO 🏷  Local node identity is: 12D3KooWH8ys3NdwcXs1svyZxMpAdqzrbLkuwT9EW4WYXTQf1mgq (legacy representation: 12D3KooWH8ys3NdwcXs1svyZxMpAdqzrbLkuwT9EW4WYXTQf1mgq)    
Apr 01 08:07:04.569  INFO 📦 Highest known block at #0    
Apr 01 08:07:04.569  INFO 〽️ Prometheus server started at 127.0.0.1:9615    
Apr 01 08:07:04.572  INFO Listening for new connections on 0.0.0.0:9946.    
Apr 01 08:07:05.091  INFO 🔍 Discovered new external address for our node: /ip4/172.17.0.4/tcp/30335/p2p/12D3KooWH8ys3NdwcXs1svyZxMpAdqzrbLkuwT9EW4WYXTQf1mgq    
Apr 01 08:07:09.574  INFO 💤 Idle (2 peers), best: #0 (0x37c1…c164), finalized #0 (0x37c1…c164), ⬇ 1.9kiB/s ⬆ 1.9kiB/s    
Apr 01 08:07:14.576  INFO 💤 Idle (2 peers), best: #0 (0x37c1…c164), finalized #0 (0x37c1…c164), ⬇ 0 ⬆ 0    
Apr 01 08:07:19.546  INFO 💤 Idle (2 peers), best: #0 (0x37c1…c164), finalized #0 (0x37c1…c164), ⬇ 0 ⬆ 0
```

