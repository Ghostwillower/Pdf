#!/bin/bash

# Startup Script for PDF Knife
# This script sets up cloudflared tunnel and starts the development server

echo "Starting PDF Knife setup..."

# Configure cloudflared tunnel route DNS
echo "Setting up cloudflared tunnel route DNS..."

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo "Warning: cloudflared is not installed. Skipping tunnel configuration."
    echo "To install cloudflared, visit: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/"
else
    # Execute cloudflared tunnel route DNS command
    if cloudflared tunnel route dns pcmcp mcp.pcmcp.tech; then
        echo "Cloudflared tunnel route DNS configured successfully!"
    else
        echo "Error: Failed to configure cloudflared tunnel route DNS"
        exit 1
    fi
fi

# Start the development server
echo ""
echo "To start the development server, uncomment one of the following options in startup.sh:"
echo "  - Option 1: python3 -m http.server 8080"
echo "  - Option 2: npx http-server -p 8080"
echo ""

# Uncomment one of the following options based on your preference:

# Option 1: Using Python 3
# python3 -m http.server 8080

# Option 2: Using Node.js http-server
# npx http-server -p 8080

echo "Startup script completed successfully!"
