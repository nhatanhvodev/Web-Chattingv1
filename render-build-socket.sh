#!/bin/bash
# Build script for socket server only - no Next.js build needed
echo "Installing socket server dependencies..."
npm install --production=false

echo "Socket server ready to start with: node socket-server.js"
