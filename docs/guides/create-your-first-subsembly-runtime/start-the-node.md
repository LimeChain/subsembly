---
description: Starting your node
---

# Start the Node

## Subsembly Development Node

We have a compiled, minimal **Substrate** node that we use for development and testing purposes. It is a modified version of [**substrate-node-template**](https://github.com/substrate-developer-hub). It uses **Aura** consensus for block production, and has support for **Balances** and **Timestamp** modules.

## Starting Your Node

In the root directory of the project, there is a **Makefile** with useful commands to run the Substrate node. Make sure to install **`make, curl`** packages, if you don't have them installed.

{% tabs %}
{% tab title="MacOS" %}
```text
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
make run-node \
NAME=node01 \
PORT=30333 \
WS-PORT=9944 \
RPC-PORT=9933 \
spec=raw-chain-spec.json
```

{% hint style="info" %}
The provided Chain spec file must be in raw format
{% endhint %}

Now, you will notice that your node is running, but no blocks are being produced. At this point you should insert your keys into the keystore. In our case, you need to insert **Aura** keys that are needed for block production:

```text
curl --location --request POST '0.0.0.0:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","clip organ olive upper oak void inject side suit toilet stick narrow","0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e"],
    "id": 1
}'
```

If you receive this result, you have successfully inserted your Aura keys to the keystore.

```text
{"jsonrpc":"2.0","result":null,"id":1}
```

Now, your node should start producing blocks:

```text
2021-06-08 11:35:01  Substrate Node    
2021-06-08 11:35:01  ✌️  version 3.0.0-unknown-x86_64-linux-gnu    
2021-06-08 11:35:01  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
2021-06-08 11:35:01  📋 Chain specification: Local Testnet    
2021-06-08 11:35:01  🏷 Node name: node01    
2021-06-08 11:35:01  👤 Role: AUTHORITY    
2021-06-08 11:35:01  💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
2021-06-08 11:35:01  ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)    
2021-06-08 11:35:01  Using default protocol ID "sup" because none is configured in the chain specs    
2021-06-08 11:35:01  🏷 Local node identity is: 12D3KooWCZ9kKYgN1VKruFjf4e5q3Z8cawpiHumFKrh4u4kw2bPu    
2021-06-08 11:35:01  📦 Highest known block at #0    
2021-06-08 11:35:01  〽️ Prometheus server started at 127.0.0.1:9615    
2021-06-08 11:35:01  Listening for new connections on 0.0.0.0:9944.    
2021-06-08 11:35:06  💤 Idle (0 peers), best: #0 (0xfe3b…7e57), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:11  💤 Idle (0 peers), best: #0 (0xfe3b…7e57), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:16  💤 Idle (0 peers), best: #0 (0xfe3b…7e57), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:21  💤 Idle (0 peers), best: #0 (0xfe3b…7e57), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:26  💤 Idle (0 peers), best: #0 (0xfe3b…7e57), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:30  🙌 Starting consensus session on top of parent 0xfe3bf94031d5c65ff6dd1454954a9a3c67bbde6ef58700ed0006950703f07e57    
2021-06-08 11:35:30  🎁 Prepared block for proposing at 1 [hash: 0x86d4ccde32bc455b307a406212d83ec22693b2ed3448717c3b6fe7cc7fea4e7c; parent_hash: 0xfe3b…7e57; extrinsics (1): [0x3570…b314]]    
2021-06-08 11:35:30  🔖 Pre-sealed block for proposal at 1. Hash now 0x23f7366f3647f9e9e267225d686c723fbe2ce642c276bb8512dae5909cc073a0, previously 0x86d4ccde32bc455b307a406212d83ec22693b2ed3448717c3b6fe7cc7fea4e7c.    
2021-06-08 11:35:30  ✨ Imported #1 (0x23f7…73a0)    
2021-06-08 11:35:31  💤 Idle (0 peers), best: #1 (0x23f7…73a0), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0 
```

But you can notice that no blocks are being finalised. For that we will need to insert **GRANDPA** keys.

```text
curl --location --request POST '0.0.0.0:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["gran","clip organ olive upper oak void inject side suit toilet stick narrow","0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781"],
    "id": 1
}'
```

And if you receive this result, you have successfully inserted your Aura keys to the keystore.

```text
{"jsonrpc":"2.0","result":null,"id":1}
```

{% hint style="danger" %}
After inserting **GRANDPA** keys it is required to restart the node to see the blocks being finalised.
{% endhint %}

After restarting the node, you should see the following result:

```text
2021-06-08 11:35:34  Substrate Node    
2021-06-08 11:35:34  ✌️  version 3.0.0-unknown-x86_64-linux-gnu    
2021-06-08 11:35:34  ❤️  by Substrate DevHub <https://github.com/substrate-developer-hub>, 2017-2021    
2021-06-08 11:35:34  📋 Chain specification: Local Testnet    
2021-06-08 11:35:34  🏷 Node name: node01    
2021-06-08 11:35:34  👤 Role: AUTHORITY    
2021-06-08 11:35:34  💾 Database: RocksDb at /tmp/node01/chains/local_testnet/db    
2021-06-08 11:35:34  ⛓  Native runtime: node-template-1 (node-template-1.tx1.au1)    
2021-06-08 11:35:34  Using default protocol ID "sup" because none is configured in the chain specs    
2021-06-08 11:35:34  🏷 Local node identity is: 12D3KooWCZ9kKYgN1VKruFjf4e5q3Z8cawpiHumFKrh4u4kw2bPu    
2021-06-08 11:35:34  📦 Highest known block at #1    
2021-06-08 11:35:34  〽️ Prometheus server started at 127.0.0.1:9615    
2021-06-08 11:35:34  Listening for new connections on 0.0.0.0:9944.    
2021-06-08 11:35:35  🙌 Starting consensus session on top of parent 0x23f7366f3647f9e9e267225d686c723fbe2ce642c276bb8512dae5909cc073a0    
2021-06-08 11:35:35  Timeout fired waiting for transaction pool at block #1. Proceeding with production.    
2021-06-08 11:35:35  🎁 Prepared block for proposing at 2 [hash: 0x00c1541bcbb8777b3dcd5ea812e998018880e520bc83cd9ef0ad3ace8b0ee1cd; parent_hash: 0x23f7…73a0; extrinsics (1): [0x4fc9…1eae]]    
2021-06-08 11:35:35  🔖 Pre-sealed block for proposal at 2. Hash now 0x94203174a47094eb118c368701ef3138ac9d3dd865fc7191a4a5ba61e57bfda7, previously 0x00c1541bcbb8777b3dcd5ea812e998018880e520bc83cd9ef0ad3ace8b0ee1cd.    
2021-06-08 11:35:35  ✨ Imported #2 (0x9420…fda7)    
2021-06-08 11:35:39  💤 Idle (0 peers), best: #2 (0x9420…fda7), finalized #0 (0xfe3b…7e57), ⬇ 0 ⬆ 0    
2021-06-08 11:35:40  🙌 Starting consensus session on top of parent 0x94203174a47094eb118c368701ef3138ac9d3dd865fc7191a4a5ba61e57bfda7    
2021-06-08 11:35:40  🎁 Prepared block for proposing at 3 [hash: 0xf2c98054ffbbd6ca63f6413025e6f0c8e7de4e81efde38453d319d850e8f15ac; parent_hash: 0x9420…fda7; extrinsics (1): [0x81b9…e987]]    
2021-06-08 11:35:40  🔖 Pre-sealed block for proposal at 3. Hash now 0x7a41966537f2cda91a24c607ccde1daa763f0df551713d4a7705f1163d11a8f6, previously 0xf2c98054ffbbd6ca63f6413025e6f0c8e7de4e81efde38453d319d850e8f15ac.    
2021-06-08 11:35:40  ✨ Imported #3 (0x7a41…a8f6)    
2021-06-08 11:35:44  💤 Idle (0 peers), best: #3 (0x7a41…a8f6), finalized #1 (0x23f7…73a0), ⬇ 0 ⬆ 0    
2021-06-08 11:35:45  🙌 Starting consensus session on top of parent 0x7a41966537f2cda91a24c607ccde1daa763f0df551713d4a7705f1163d11a8f6    
2021-06-08 11:35:45  🎁 Prepared block for proposing at 4 [hash: 0x9bcf3ec7c497bf10cf35fe01f96d3c163f305e8e82a354eef09c5ceec457299d; parent_hash: 0x7a41…a8f6; extrinsics (1): [0x0db2…e5c2]]    
2021-06-08 11:35:45  🔖 Pre-sealed block for proposal at 4. Hash now 0x53c5df68e4ad3a507d403c54df287f27a1a32c6c19ef4ddaa5bd03f005665204, previously 0x9bcf3ec7c497bf10cf35fe01f96d3c163f305e8e82a354eef09c5ceec457299d.    
2021-06-08 11:35:45  ✨ Imported #4 (0x53c5…5204)    
2021-06-08 11:35:49  💤 Idle (0 peers), best: #4 (0x53c5…5204), finalized #2 (0x9420…fda7), ⬇ 0 ⬆ 0    
2021-06-08 11:35:50  🙌 Starting consensus session on top of parent 0x53c5df68e4ad3a507d403c54df287f27a1a32c6c19ef4ddaa5bd03f005665204    
2021-06-08 11:35:50  🎁 Prepared block for proposing at 5 [hash: 0x3447fe18d206ab218ba73663f5a1ea3c26b0ceb6dc414fda3a16286e99a5e4b3; parent_hash: 0x53c5…5204; extrinsics (1): [0xc097…eea7]]    
2021-06-08 11:35:50  🔖 Pre-sealed block for proposal at 5. Hash now 0x62d4808365c4ab34daa236c2c3724376e0850b0abd3945cc52c34446a7336a49, previously 0x3447fe18d206ab218ba73663f5a1ea3c26b0ceb6dc414fda3a16286e99a5e4b3.
```

