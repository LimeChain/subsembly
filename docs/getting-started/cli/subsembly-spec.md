---
description: Spec files
---

# subsembly spec

### Overview

A command used for generating chain specification files and converting them into raw one.

### Syntax

```text
subsembly spec [to] [src] [raw] [wasm]
```

#### Parameters

* **`--to`** - optional parameter, determines initialisation path for the new chain specification file, defaults to current directory
* **`--src`** - optional parameter, determines source specification file to convert to raw, defaults to current directory
* **`--raw`** - optional parameter, determines path to save converted raw chain specification file. Defaults to **`{path-of-src}/raw-chain-spec.json`**
* **`--wasm`** - optional parameter, determines path to the compiled hex encoded **`wasm`** binary. Defaults to **`build/subsembly-wasm`**

### Examples

{% tabs %}
{% tab title="1st" %}
```bash
# Generating new chain spec file
subsembly-user new-sub % subsembly spec
Successfully generated new custom spec file!
```
{% endtab %}

{% tab title="2nd" %}
```bash
# or (it is recommended to put all your spec files inside spec-files/ folder in root directory)
subsembly-user new-sub % subsembly spec --to=./chain-spec.json
Successfully generated new custom spec file!
```
{% endtab %}
{% endtabs %}

Both commands will produce the same output:

```bash
# Contents of the chain-spec.json
subsembly-user new-sub % cat chain-spec.json
{
  "name": "Local Testnet",
  "id": "local_testnet",
  "chainType": "Local",
  "bootNodes": [],
  "telemetryEndpoints": null,
  "protocolId": null,
  "properties": null,
  "consensusEngine": null,
  "genesis": {
    "runtime": {
      "system": {
        "code": "0x"
      },
      "balances": {
        "balances": [
          [
            "5F25Yb9PB9GV6RcqKpWceyx1X48TfnBxWn9m84A1JUYvsEF2",
            1000001803
          ],
          [
            "5CnyWwRgxbjqPyi4y9zMFjUWPjgw7M1SLzzehHRnp4K52M1L",
            1000001803
          ],
          [
            "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs",
            1000001803
          ],
          [
            "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
            1000001803
          ],
          [
            "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
            1000001803
          ]
        ]
      },
      "aura": {
        "authorities": [
          "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs"
        ]
      }
    }
  }
}
```

Converting spec file to raw:

{% tabs %}
{% tab title="1st" %}
```bash
# Converting chain spec file to raw
subsembly-user new-sub % subsembly spec --src=./spec-files/chain-spec.json --raw=./spec-files/raw-chain-spec.json --wasm=./build/subsembly-wasm
```
{% endtab %}

{% tab title="2nd" %}
```bash
# or (places new raw spec file in ./spec-files, if wasm exists in /build)
subsembly-user new-sub % subsembly spec --src=./spec-files/chain-spec.json
```
{% endtab %}

{% tab title="3rd" %}
```bash
# or (places new raw spec file in current directory, if wasm exists in /build)
subsembly-user new-sub % subsembly spec --src=./spec-files/chain-spec.json --raw=./
```
{% endtab %}
{% endtabs %}

Either of these commands will produce the same output:

{% hint style="warning" %}
This raw spec file is strictly for demonstration purposes.
{% endhint %}

```bash
subsembly-user new-sub % cat raw-chain-spec.json
{
    "name": "Local Testnet",
    "id": "local_testnet",
    "chainType": "Local",
    "bootNodes": [],
    "telemetryEndpoints": null,
    "protocolId": null,
    "properties": null,
    "consensusEngine": null,
    "genesis": {
      "raw": {
        "top": {
          "0x3a636f6465": "0x00...12100",
          "0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9d03d56e603c165d01a5d30685d13a92a": "0x0bd19a3b00000000000000000000000000000000000000000000000000000000",
          "0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9e81ba99a0bb95d747f27a3ead08fe418": "0x0bd19a3b00000000000000000000000000000000000000000000000000000000",
          "0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9c6ebe5ded0e8dd4d0db5692e34d8116a": "0x0bd19a3b00000000000000000000000000000000000000000000000000000000",
          "0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9518366b5b1bc7c99bae0ba710af1ac66": "0x0bd19a3b00000000000000000000000000000000000000000000000000000000",
          "0xc2261276cc9d1f8598ea4b6a74b15c2fb99d880ec681799c0cf30e8886371da9a647e755c30521d3d8cb3b41eccb98ea": "0x0bd19a3b00000000000000000000000000000000000000000000000000000000",
          "0x57f8dc2f5ab09467896f47300f0424385e0621c4869aa60c02be9adcc98a0d1d": "0x04dcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa9659"
        },
        "childrenDefault": {}
      }
    }
  }
```

