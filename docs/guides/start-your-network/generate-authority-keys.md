# Prepare the Network

## Overview

Each node who wants to participate as validator in the blockchain network must generate their own private/public keys. In this section, we will generate two keys for the 2 validator nodes - `Alice` and `Bob`.

## Option 1: Subkey

**`Subkey`** is a tool that generates keys specifically designed to be used with Substrate. The installation instructions can be found [here](https://substrate.dev/docs/en/knowledgebase/integrate/subkey).

After you've installed the tool, it's time to generate the validator keys. We need to generate **`sr25519`** keys that will be used by Aura for block production.

```text
subkey generate --scheme sr25519
```

You should see output similar to this:

```text
Secret phrase `lady demand candy vacuum warm nurse shaft garment horror list burst strike` is account:
  Secret seed:      0xfd3a2bd1b11943302b4a007857189629be5ae7ba55bf90a15f6eca939d6c763b
  Public key (hex): 0xec9fd69c119fb45b6f6efca397db3e864649e6903cf227d4609ed53a66d3bf1e
  Account ID:       0xec9fd69c119fb45b6f6efca397db3e864649e6903cf227d4609ed53a66d3bf1e
  SS58 Address:     5HQxe4hw4bZm5uK4kUeq3Wkvw7Uem7NesYjB53BjAUizNZN6
```

**Important**

Make sure to save your mnemonic phrase, public key and SS58 address variables as they will be used later.

Perform the key generation twice, for both of the nodes and save the mnemonic, public key and SS58 address for the second generation as-well.

## Option 2: PolkadotJs

You can also generate your own keys using **PolkadotJs** interface. In the **Accounts** tab, select **Add Account** button. This will generate **`sr25519`** keys by default. Again, make sure to save your mnemonic seed and public key.

For example:

![Picture 1. Account generation](../../.gitbook/assets/screenshot-2021-03-31-at-18.00.40.png)

### Modify the Chain Spec

We have already done this step in the last [guide](../create-your-first-subsembly-runtime/) and in the [Development](../../development/development.md) section. So the default content of **`chain-spec.json`** looks like this:

```text
//--snip--//
"runtime": {
      "system": {
        "code": "0x"
      },
      "aura": {
        "authorities": [
          "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs"
        ]
      }
    }
    //--snip--//
```

**`aura.authorities`** property in the chain spec defines the list of public keys or authorities that have the right to produce blocks. Delete the already specified authority in the list and add the 2 SS58 addresses that you generated

```text
//--snip--/
"runtime": {
      "system": {
        "code": "0x"
      },
      "aura": {
        "authorities": [
          "5H49oi57ktRnYTbhVtKpGGk79rB9QXNcApYELLWcKa9W8nfs",
          "5HQxe4hw4bZm5uK4kUeq3Wkvw7Uem7NesYjB53BjAUizNZN6"
        ]
      }
    }
    //--snip--/
```

And don't forget to convert your modified chain spec into raw:

```text
subsembly spec --src=./chain-spec.json
```

