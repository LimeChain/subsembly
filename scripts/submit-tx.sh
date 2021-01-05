curl --location --request POST 'localhost:9933' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "author_submitExtrinsic",
    "params": ["0x4502dcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa965982b3f9330690e5a74aa9806d71298e68a03d80e773332f615e3bdd64ee71f05001000000000000000100000000000000143c126b29b70f209d2d68f1cde4805f432e40bb25e9919c1695cb14beb2bc7c799c63e5ad304c1940d5cc14c928efec2e8bf27970cb232a1aa5081345f5788900"],
    "id": 2
}
'