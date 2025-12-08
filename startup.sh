#!/bin/bash

# Startup Script for PDF Knife
# This script sets up cloudflared tunnel and starts the development server

echo "Starting PDF Knife setup..."

# Configure cloudflared tunnel route DNS
echo "Setting up cloudflared tunnel route DNS..."
cloudflared tunnel route dns pcmcp mcp.pcmcp.tech

# Start the development server
echo "Starting development server..."
# Uncomment one of the following options based on your preference:

# Option 1: Using Python 3
# python3 -m http.server 8080

# Option 2: Using Node.js http-server
# npx http-server -p 8080

echo "Startup script completed!"
echo "Note: Uncomment your preferred server option in startup.sh to start the development server"
