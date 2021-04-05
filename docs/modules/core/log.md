---
description: Logging module
---

# Log

### Overview

Log module is used for displaying log messages to the host. The three types of messages are supported: **`info`**, **`warn`** and **`error`**. This module is defined in **`subsembly-core`** package and should be imported from it before using.

### Examples

```text
import {Log} from 'subsembly-core'

// log informing message
Log.info("Important message");

// log warning message
Log.warn("Warning!);

// log error message
Log.error("Error here!");
```

