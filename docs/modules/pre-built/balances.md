---
description: Account balance manipulation
---

# Balances

### Overview

The Balances module provides functionality for manipulating accounts and balances. It provides functionality to:

* Get and set account balances
* Retrieving free and reserved balances
* Validating transactions
* Creating accounts
* Transferring an amount between accounts \(only free balance\)

### Dispatchable Calls

Balances module exposes following dispatchable calls that could be included in the extrinsic:

* **`transfer`** - transfer some liquid free balance to another account.
* **`setBalance`** - set the balances of a given account. 

### Configuration

The initial accounts and their token balances are defined in genesis configuration. Also, some constants are defined for the Balances module: 

* **`existentialDeposit`** - the minimum balance an account may have



