#!/bin/sh
# Publishes site/ to the gh-pages branch of this repository's origin, replacing what is there.
set -eu
cd "$(dirname "$0")"
ORIGIN=$(git remote get-url origin)
cd site
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Publish \"BikeTO for Bike Share Toronto\" with Webslides"
git push -q -f "$ORIGIN" gh-pages
rm -rf .git
echo "Published to gh-pages."
