#!/bin/bash
set -e

PROJECT_NAME="${PROJECT_NAME:-connect4-ui}"

build() {
	docker build \
		-t "wexel/$PROJECT_NAME:latest" \
		.
}

build
