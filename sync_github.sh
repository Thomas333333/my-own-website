#!/bin/bash

echo "Syncing repository..."

git add --all

git commit -m "Update content" || echo "No changes to commit"

git push origin main

echo "Done."
