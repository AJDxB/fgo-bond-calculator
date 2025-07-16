#!/bin/bash

# Test script to simulate the GitHub Actions workflow locally
echo "Testing workflow logic..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm ci

# Step 2: Fetch NA servants data
echo "Fetching NA servant data..."
node fetch_servants.js
echo "NA fetch completed"
ls -la public/servants.json

# Step 3: Fetch JP servants data
echo "Fetching JP servant data..."
node fetch_servants_jp.js
echo "JP fetch completed"
ls -la public/servants_jp.json

# Step 4: Verify data files
if [ ! -f "public/servants.json" ] || [ ! -f "public/servants_jp.json" ]; then
    echo "Error: One or more servant data files are missing!"
    exit 1
fi
echo "Both servant data files present and updated successfully"

# Step 5: Check for changes
if git diff --quiet public/servants.json public/servants_jp.json; then
    echo "No changes detected in servant data files"
    echo "changes=false"
else
    echo "Changes detected in servant data files"
    echo "changes=true"
    git diff --name-only public/servants.json public/servants_jp.json
fi

echo "Workflow test completed successfully!"
