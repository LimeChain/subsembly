lsof -n | grep LISTEN > /dev/null
curl --location --request POST '0.0.0.0:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["aura","clip organ olive upper oak void inject side suit toilet stick narrow","0x9effc1668ca381c242885516ec9fa2b19c67b6684c02a8a3237b6862e5c8cd7e"],
    "id": 1
}'
lsof -n | grep LISTEN > /dev/null
curl --location --request POST '0.0.0.0:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_insertKey",
    "params": ["gran","clip organ olive upper oak void inject side suit toilet stick narrow","0xb48004c6e1625282313b07d1c9950935e86894a2e4f21fb1ffee9854d180c781"],
    "id": 1
}'
