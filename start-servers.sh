#!/bin/bash

# MySimpleDesk Server Startup Script
echo "🚀 Starting MySimpleDesk servers..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}Port $1 is already in use${NC}"
        return 1
    else
        echo -e "${GREEN}Port $1 is available${NC}"
        return 0
    fi
}

# Function to kill processes on port
kill_port() {
    echo -e "${YELLOW}Killing processes on port $1...${NC}"
    lsof -ti:$1 | xargs kill -9 2>/dev/null || true
}

# Check and clear ports
echo -e "${BLUE}Checking ports...${NC}"
if ! check_port 3001; then
    kill_port 3001
fi

if ! check_port 3000; then
    kill_port 3000
fi

# Wait a moment for ports to clear
sleep 2

# Check Node.js version
echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}Node.js version: $(node --version)${NC}"
else
    echo -e "${RED}Node.js not found! Please install Node.js${NC}"
    exit 1
fi

# Check if dependencies are installed
echo -e "${BLUE}Checking backend dependencies...${NC}"
cd "$(dirname "$0")/backend"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

echo -e "${BLUE}Checking frontend dependencies...${NC}"
cd "../frontend"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Check if frontend build exists
if [ ! -d "build" ]; then
    echo -e "${YELLOW}Building frontend...${NC}"
    CI=false npm run build
fi

# Start backend server in background
echo -e "${BLUE}Starting backend server...${NC}"
cd "../backend"
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend started successfully
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Backend server started on port 3001${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    exit 1
fi

# Start frontend server
echo -e "${BLUE}Starting frontend server...${NC}"
cd "../frontend"
npx serve -s build -l 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend started successfully
if kill -0 $FRONTEND_PID 2>/dev/null; then
    echo -e "${GREEN}✅ Frontend server started on port 3000${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}"
echo "🎉 MySimpleDesk is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "🤖 AI Demo: http://localhost:3000/ai-test"
echo ""
echo "Press Ctrl+C to stop both servers"
echo -e "${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}Servers stopped${NC}"
    exit 0
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running and show logs
wait