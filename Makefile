all: run-node

# Name of our Docker image
DOCKER_IMAGE=limechain/as-substrate:latest
# Name of our Docker container
DOCKER_CONTAINER=as-substrate-node

# Run Docker container in a detached mode
run-node:
	@echo "Running the container in detached mode"
ifdef detached
	@docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/${spec}":/customSpecRaw.json -d $(DOCKER_IMAGE)
else
	@docker run -p 9933:9933 -p 9944:9944 -p 30333:30333 -v "$(CURDIR)/${spec}":/customSpecRaw.json $(DOCKER_IMAGE)
endif
