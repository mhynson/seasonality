# Variables
APP_NAME=seasonality-app
DOCKER_IMAGE=nextjs-app
DOCKER_TAG=latest
DOCKER_CONTAINER=nextjs-container

# Docker build command
build:
	docker build -t $(DOCKER_IMAGE):$(DOCKER_TAG) .

# Docker run command
run:
	docker run --rm -p 3000:3000 --name $(DOCKER_CONTAINER) $(DOCKER_IMAGE):$(DOCKER_TAG)

# Docker stop command
stop:
	docker stop $(DOCKER_CONTAINER)

# Docker remove command
rm:
	docker rm $(DOCKER_CONTAINER)

# Clean up Docker resources
clean: stop rm
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG)

# Rebuild and run
rebuild: clean build run

.PHONY: build run stop rm clean rebuild
