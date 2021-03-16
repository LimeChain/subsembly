---
description: Wrapper module for consensus
---

# Aura

### Overview

The Aura module extends Aura consensus by providing set of utility functions. 

### Consensus

Aura, also known as Authority-round, is a consensus in Substrate. It works by providing list of authorities who are expected to roughly agree on the current time. Aura works by having a list of authorities A who are expected to roughly agree on the current time. Time is divided up into discrete slots of t seconds each. For each slot **`s`**, the author of that slot is **`A[s % |A|]`**

The author is allowed to issue one block but not more during that slot, and it will be built upon the longest valid chain that has been seen.

Blocks from future steps will be either deferred or rejected depending on how far in the future they are.

NOTE: Aura itself is designed to be generic over the crypto used.

For more, visit Aura [docs](https://substrate.dev/rustdocs/v3.0.0/sc_consensus_aura/index.html).

### Functions

* **`_getSlotDuration(): Moment`** - gets the configured Slot Duration
* **`_getAuthorities(): u8[]`** - gets list of Authorities as SCALE encoded bytes 
* **`_checkInherent(t: Moment, data: InherentData): bool` -** verifies the validity of the inherent using the timestamp





