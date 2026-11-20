#!/bin/sh
# Builds the deck into site/ with the Webslides packages in $WEBSLIDES_DIR (default ~/Coding/webslides).
set -eu
cd "$(dirname "$0")"
WEBSLIDES_DIR="${WEBSLIDES_DIR:-$HOME/Coding/webslides}"
VITE_NODE=$(ls -d "$WEBSLIDES_DIR"/node_modules/.pnpm/vite-node@*/node_modules/vite-node/vite-node.mjs | head -1)
NODE_ENV=production WEBSLIDES_DIR="$WEBSLIDES_DIR" node "$VITE_NODE" --config tools/vite.config.ts tools/build.ts
