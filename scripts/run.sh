#!/bin/bash
set -e

PROJECT_NAME="${PROJECT_NAME:-connect4-ui}"

run() {
	docker run \
		-p '8080:80' \
		--name "$PROJECT_NAME" \
		-d "wexel/$PROJECT_NAME:latest"
}

run
