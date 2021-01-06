yarn build
#!/usr/bin/env bash
hex="0x"
result=${hex}$( cat wasm-code )
mv ./spec-files/customSpecRaw.json ./spec-files/temp-raw.json
jq --arg res "${result}" '.genesis.raw.top."0x3a636f6465" |= $res' ./spec-files/temp-raw.json > ./spec-files/customSpecRaw.json
rm ./spec-files/temp-raw.json