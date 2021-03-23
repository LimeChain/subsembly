---
description: Starting your node
---

# Start the Node

### Subsembly Development Node

We have a compiled, minimal **Substrate** node that we use for development and testing purposes. It is a modified version of [**substrate-node-template**](https://github.com/substrate-developer-hub) It uses **Aura** consensus for block production, and has a support to pallets like: **Balances** and **Timestamp**.

### Starting Your Node

In the root directory of the project, there is a **Makefile** with useful commands to run the Substrate node. Make sure to install **`make, curl`** packages, if you don't have them installed.

{% tabs %}
{% tab title="MacOS" %}
```
brew install make curl
```
{% endtab %}

{% tab title="Linux" %}
```text
apt-get install make curl
```
{% endtab %}
{% endtabs %}

After we have the required packages installed, we can run **Substrate** node with our runtime:

```text
make run-node spec=./raw-chain-spec.json
```

{% hint style="info" %}
Chain spec file argument should be in raw format
{% endhint %}

Now, you will notice that your node is running, but no blocks are being produced. At this point you should insert your keys into the keystore. In our case, you need to insert **Aura** keys that are needed 

But it won't produce blocks yet. For it to start block production, insert **Aura** keys to the keystore. 

Remember your mnemonic seed and public address and insert your keys using **Curl**:

```text
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","<your mnemonic phrase>","<your public key>"],
    "id": 1
}'
```

If you receive this result, you have successfully inserted your Aura keys to the keystore.

```text
{"jsonrpc":"2.0","result":null,"id":1}
```

Now, your node should start producing blocks:

```text
Mar 23 13:35:15.524  INFO Substrate Node    
Mar 23 13:35:15.524  INFO ✌️  version 2.0.0-unknown-x86_64-linux-gnu    
Mar 23 13:35:15.524  INFO ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
Mar 23 13:35:15.525  INFO 📋 Chain specification: Local Testnet    
Mar 23 13:35:15.525  INFO 🏷  Node name: Node01    
Mar 23 13:35:15.525  INFO 👤 Role: AUTHORITY    
Mar 23 13:35:15.525  INFO 💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
Mar 23 13:35:15.525  INFO ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)    
Mar 23 13:35:15.966  INFO 🔨 Initializing Genesis block/state (state: 0x7f78…b9f9, header-hash: 0x2df5…f598)    
Mar 23 13:35:16.020  INFO ⏱  Loaded block-time = 5000 milliseconds from genesis on first-launch    
Mar 23 13:35:16.021  WARN Using default protocol ID "sup" because none is configured in the chain specs    
Mar 23 13:35:16.030  INFO 🏷  Local node identity is: 12D3KooWKQvopYxZ1wRh5rgxY5gAzJBuknSmJwS5ThovJNhQyqpy (legacy representation: 12D3KooWKQvopYxZ1wRh5rgxY5gAzJBuknSmJwS5ThovJNhQyqpy)    
Mar 23 13:35:16.054  INFO 📦 Highest known block at #0    
Mar 23 13:35:16.058  INFO 〽️ Prometheus server started at 127.0.0.1:9615    
Mar 23 13:35:16.067  INFO Listening for new connections on 0.0.0.0:9944.  
Mar 23 13:35:41.041  INFO 💤 Idle (0 peers), best: #0 (0x2df5…f598), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:35:46.041  INFO 💤 Idle (0 peers), best: #0 (0x2df5…f598), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:35:50.026  INFO 🙌 Starting consensus session on top of parent 0x2df51d274299e45bf7e7fe937c42c3789015a562fbbfaf78d043a59f64a1f598    
Mar 23 13:35:50.081  INFO 🎁 Prepared block for proposing at 1 [hash: 0xc53e5594014ab33e4e3fed08704227604d7aa54019ad6edd0d7ad37d3091d238; parent_hash: 0x2df5…f598; extrinsics (1): [0x02bc…02c2]]    
Mar 23 13:35:50.085  INFO 🔖 Pre-sealed block for proposal at 1. Hash now 0xcbc9496220d89f2efb0ddd344710e76534a9cec9943ce9d4d7f0696882a3d8b4, previously 0xc53e5594014ab33e4e3fed08704227604d7aa54019ad6edd0d7ad37d3091d238.    
Mar 23 13:35:50.086  INFO ✨ Imported #1 (0xcbc9…d8b4)    
Mar 23 13:35:51.010  INFO 💤 Idle (0 peers), best: #1 (0xcbc9…d8b4), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:35:55.024  INFO 🙌 Starting consensus session on top of parent 0xcbc9496220d89f2efb0ddd344710e76534a9cec9943ce9d4d7f0696882a3d8b4    
Mar 23 13:35:55.079  INFO 🎁 Prepared block for proposing at 2 [hash: 0xa8d90c9d83bf5be8d4b5f6b83d65dbf2bee04bb4811159d571e5275be6c839d8; parent_hash: 0xcbc9…d8b4; extrinsics (1): [0xb620…d531]]    
Mar 23 13:35:55.082  INFO 🔖 Pre-sealed block for proposal at 2. Hash now 0x1c4239f2f39ba23d38d76ced5168932d4ca9e9f3c2ce1ba40a7b252f506e8d7b, previously 0xa8d90c9d83bf5be8d4b5f6b83d65dbf2bee04bb4811159d571e5275be6c839d8.    
Mar 23 13:35:55.083  INFO ✨ Imported #2 (0x1c42…8d7b)    
Mar 23 13:35:56.011  INFO 💤 Idle (0 peers), best: #2 (0x1c42…8d7b), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:36:00.023  INFO 🙌 Starting consensus session on top of parent 0x1c4239f2f39ba23d38d76ced5168932d4ca9e9f3c2ce1ba40a7b252f506e8d7b    
Mar 23 13:36:00.079  INFO 🎁 Prepared block for proposing at 3 [hash: 0xf4a555f3f22826c3fd948018cf2130ed4fb0edce59b0cca2ed0a305fde38cca9; parent_hash: 0x1c42…8d7b; extrinsics (1): [0xbd79…6f60]]    
Mar 23 13:36:00.085  INFO 🔖 Pre-sealed block for proposal at 3. Hash now 0x2fddaf1a42df38822e91b439b9b8c6a8d28022c0a988646c7d53ee4730eb5dc7, previously 0xf4a555f3f22826c3fd948018cf2130ed4fb0edce59b0cca2ed0a305fde38cca9.    
Mar 23 13:36:00.086  INFO ✨ Imported #3 (0x2fdd…5dc7)    
Mar 23 13:36:01.014  INFO 💤 Idle (0 peers), best: #3 (0x2fdd…5dc7), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:36:05.025  INFO 🙌 Starting consensus session on top of parent 0x2fddaf1a42df38822e91b439b9b8c6a8d28022c0a988646c7d53ee4730eb5dc7    
Mar 23 13:36:05.076  INFO 🎁 Prepared block for proposing at 4 [hash: 0xc247833cc10066d8b72b5277150e52dd2ba6c80f72786b59f0639d364664b7d4; parent_hash: 0x2fdd…5dc7; extrinsics (1): [0x13de…fb33]]    
Mar 23 13:36:05.080  INFO 🔖 Pre-sealed block for proposal at 4. Hash now 0xfaa2664656499312909d26c042440f320dae69d9bc24c6b8c27fff6c9925da87, previously 0xc247833cc10066d8b72b5277150e52dd2ba6c80f72786b59f0639d364664b7d4.    
Mar 23 13:36:05.080  INFO ✨ Imported #4 (0xfaa2…da87)    
Mar 23 13:36:06.015  INFO 💤 Idle (0 peers), best: #4 (0xfaa2…da87), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:36:10.022  INFO 🙌 Starting consensus session on top of parent 0xfaa2664656499312909d26c042440f320dae69d9bc24c6b8c27fff6c9925da87    
Mar 23 13:36:10.075  INFO 🎁 Prepared block for proposing at 5 [hash: 0x6a99338a69f4ca678c9df175620c9cf7f16962b0434e9476cbbd8a025847f07d; parent_hash: 0xfaa2…da87; extrinsics (1): [0x6b57…0773]]    
Mar 23 13:36:10.078  INFO 🔖 Pre-sealed block for proposal at 5. Hash now 0x7ea9f27ee99635dcf41ca4ccc4983fb5806dc14bf473722751b12356aa625ad0, previously 0x6a99338a69f4ca678c9df175620c9cf7f16962b0434e9476cbbd8a025847f07d.    
Mar 23 13:36:10.080  INFO ✨ Imported #5 (0x7ea9…5ad0)    
Mar 23 13:36:11.017  INFO 💤 Idle (0 peers), best: #5 (0x7ea9…5ad0), finalized #0 (0x2df5…f598), ⬇ 0 ⬆ 0    
Mar 23 13:36:15.021  INFO 🙌 Starting consensus session on top of parent 0x7ea9f27ee99635dcf41ca4ccc4983fb5806dc14bf473722751b12356aa625ad0    
```



