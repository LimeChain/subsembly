yarn build
#!/usr/bin/env bash
hex="0x"
result=${hex}$( cat wasm-code )
cat ./spec-files/customSpecRaw.json | jq --arg res "${result}" '.genesis.raw.top."0x3a636f6465" |= $res' | tee ./spec-files/customSpecRaw.json > /dev/null