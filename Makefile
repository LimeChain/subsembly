all: run-node-demo run-node

# Name of our Docker image
DOCKER_IMAGE=limechain/as-substrate:latest
# Name of our Docker container
DOCKER_CONTAINER=as-substrate-node

# build the runtime wasm code
build_runtime:
	@echo "Building runtime"
	@cd runtime && yarn install 1> /dev/null && yarn build 1> /dev/null

# generate raw chain spec for the node
generate_chain_spec: build_runtime
	@echo "Generating raw chain spec file"
	@yarn --cwd=./runtime build-spec -f ../spec-files/customSpec.json -o ../spec-files/customSpecRaw.json -c ./wasm-code > /dev/null

# Run Docker container in a detached mode
run-node:
	@echo "Running the container in detached mode"
	@bash compile.sh
	@docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/spec-files/customSpecRaw.json":/customSpecRaw.json $(DOCKER_IMAGE)

# Insert the Aura keys and re-attach the container to the shell
# for some reason, if I don't do lsof, curl returns `empty reply from server` error

run-node-demo:
	@docker ps -q --filter "name=$(DOCKER_CONTAINER)" | grep -q . && docker stop $(DOCKER_CONTAINER) || true && docker rm $(DOCKER_CONTAINER) || true > /dev/null
	@docker run --name=$(DOCKER_CONTAINER) -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/spec-files/demoSpecRaw.json":/customSpecRaw.json -d $(DOCKER_IMAGE)
	@lsof -n | grep LISTEN > /dev/null
	@echo "Inserting Aura keys"
	@curl --request POST 'http://localhost:9933' \
		--header 'Content-Type: application/json' \
		--data-raw '{ \
			"jsonrpc": "2.0", \
			"method": "author_insertKey", \
			"params": ["aura","dice height enter anger ahead chronic easily wave curious banana era happy","0xdcc1461cba689c60dcae053ef09bc9e9524cdceb696ce39c7ed43bf3a5fa9659"], \
			"id": 1 \
		}'
	@echo "Re-attach the container"
	@docker attach $(DOCKER_CONTAINER)

run-network:
	@docker-compose up