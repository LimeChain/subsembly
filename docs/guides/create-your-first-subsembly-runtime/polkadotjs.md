---
description: Interact with your runtime with PolkadotJS
---

# PolkadotJS

## Interact

Once your node is running, go to PolkadotJS interface at [https://polkadot.js.org/apps](https://polkadot.js.org/apps). PolkadotJS interface provides an interface for interacting with your node. You can explore the produced blocks, query the chain storage, submit extrinsics, etc. In this section we will explore various ways to interact with your runtime.

## Insert Aura keys

One other option to insert your Aura keys is using PolkadotJS:

Fill out the necessary fields and submit the `rpc` call.

![Picture 1. Inserting Aura keys](../../.gitbook/assets/screenshot-2021-03-23-at-17.32.55.png)

## Accounts

In the accounts tab, you can explore list of accounts in the storage:

![Picture 2. Accounts tab](../../.gitbook/assets/screenshot-2021-03-23-at-17.40.28.png)

## Transfers

Go to the **Extrinsics** section of the **Developer** tab and select **`transfer`** extrinsic call:

![Picture 3. Balances transfer](../../.gitbook/assets/screenshot-2021-04-02-at-1.44.48.png)

Fill up the fields and submit the transaction. The next window will look similar to this:

![Picture 4. Transaction authorization](../../.gitbook/assets/screenshot-2021-04-02-at-1.45.59.png)

Click **Sign and Submit** to send the transfer and in couple of seconds, you will get a notification about the status of your transaction:

![Picture 5. Successful transaction example](../../.gitbook/assets/screenshot-2021-04-02-at-1.47.21.png)

## Others

You can see the block issuance and the details of the produced blocks. Querying the state of the chain can be done in the `Developer` -&gt; `Chain state`

