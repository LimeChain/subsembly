lsof -n | grep LISTEN > /dev/null
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "chain_getHeader",
    "params": [],
    "id": 1
}'