lsof -n | grep LISTEN > /dev/null
curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_submitExtrinsic",
    "params": ["0xc10284d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d01c47b9cc5d9147546bb64d7fe5943a21d0be1509546559eedda91b83dea737129a1a37a5bd774fe70924385286fb5aeee62ad67dcf250915d0346f5c50f24d88aa50000000200d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48640000000000000"],
    "id": 2
}
'