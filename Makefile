all: run-node

# Name of our Docker image
DOCKER_IMAGE=limechain/as-substrate:latest
# Name of our Docker container
DOCKER_CONTAINER=as-substrate-node

# Run Docker container in a detached mode
run-node-demo:
	@echo "Running the container in detached mode"
ifdef detached
	@docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/${spec}":/customSpecRaw.json -d $(DOCKER_IMAGE)
else
	@docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/${spec}":/customSpecRaw.json $(DOCKER_IMAGE)
endif

run-node:
ifdef help
	@docker run -it limechain/as-substrate:node-v1 --help
else
	@docker run -p ${RPC-PORT}:${RPC-PORT} -p ${WS-PORT}:${WS-PORT} -p ${PORT}:${PORT} -v "$(CURDIR)/${spec}":/raw-chain-spec.json limechain/as-substrate:grandpa --base-path /tmp/${NAME} --port ${PORT} --ws-port ${WS-PORT} --rpc-port ${RPC-PORT} --execution Wasm --offchain-worker Never --name=${NAME} ${OTHER}
endif