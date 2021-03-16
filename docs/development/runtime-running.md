---
description: Running the runtime
---

# Runtime Execution

### Building

To compile the runtime:

```text
subsembly compile
```

This should compile your runtime and place hex-encoded **`wasm`** binary to the **`build`** folder.

The next step is to prepare your first chain specification file:

```text
subsembly spec --to=./chain-spec.json
```

Then, we convert the spec file to raw:

```text
subsembly spec --src=./chain-spec.json --raw=./raw-chain-spec.json
```

### Running

In the root directory of the project, there is a Makefile with useful commands to run the Substrate node. Make sure to install **`make, curl`** packages, if you don't have them installed.

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

After we have the required packages installed, we can run Substrate node with our runtime:

```text
make run-node spec=./raw-chain-spec.json
```

**NOTE:** Chain spec file argument should be in raw format

Now, your node should be up and running. But it won't produce blocks yet. For it to start block production, insert Aura keys to the keystore. 

Example using Curl:

```text
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","{insert-your-mnemonic-seed}","{insert-your-public-key}"],
    "id": 1
}'
```

