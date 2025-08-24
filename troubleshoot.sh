#!/bin/bash

# MySimpleDesk Troubleshooting Script
echo "🔍 MySimpleDesk Troubleshooting Diagnostic"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Change to project directory
cd "$(dirname "$0")"

echo -e "${BLUE}1. Checking system requirements...${NC}"

# Check Node.js
if command -v node >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Node.js installed: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "   Install Node.js from https://nodejs.org/"
fi

# Check npm
if command -v npm >/dev/null 2>&1; then
    echo -e "${GREEN}✅ npm installed: $(npm --version)${NC}"
else
    echo -e "${RED}❌ npm not found${NC}"
fi

echo -e "\n${BLUE}2. Checking project structure...${NC}"

# Check backend files
if [ -f "backend/server.js" ]; then
    echo -e "${GREEN}✅ Backend server.js exists${NC}"
else
    echo -e "${RED}❌ Backend server.js missing${NC}"
fi

if [ -f "backend/package.json" ]; then
    echo -e "${GREEN}✅ Backend package.json exists${NC}"
else
    echo -e "${RED}❌ Backend package.json missing${NC}"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dependencies not installed${NC}"
    echo "   Run: cd backend && npm install"
fi

# Check frontend files
if [ -f "frontend/package.json" ]; then
    echo -e "${GREEN}✅ Frontend package.json exists${NC}"
else
    echo -e "${RED}❌ Frontend package.json missing${NC}"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed${NC}"
    echo "   Run: cd frontend && npm install"
fi

if [ -d "frontend/build" ]; then
    echo -e "${GREEN}✅ Frontend build exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend build missing${NC}"
    echo "   Run: cd frontend && npm run build"
fi

echo -e "\n${BLUE}3. Checking environment configuration...${NC}"

if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
    
    # Check key environment variables
    if grep -q "PORT=3001" backend/.env; then
        echo -e "${GREEN}✅ PORT configured${NC}"
    else
        echo -e "${YELLOW}⚠️  PORT not configured${NC}"
    fi
    
    if grep -q "JWT_SECRET=" backend/.env; then
        echo -e "${GREEN}✅ JWT_SECRET configured${NC}"
    else
        echo -e "${YELLOW}⚠️  JWT_SECRET not configured${NC}"
    fi
else
    echo -e "${RED}❌ Backend .env file missing${NC}"
    echo "   Copy .env.example to .env and configure"
fi

echo -e "\n${BLUE}4. Checking ports...${NC}"

# Check if ports are in use
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3001 is in use${NC}"
    echo "   Processes using port 3001:"
    lsof -i :3001
else
    echo -e "${GREEN}✅ Port 3001 available${NC}"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 is in use${NC}"
    echo "   Processes using port 3000:"
    lsof -i :3000
else
    echo -e "${GREEN}✅ Port 3000 available${NC}"
fi

echo -e "\n${BLUE}5. Testing basic functionality...${NC}"

# Test Node.js with backend entry file
echo "Testing backend server file..."
cd backend
if node -c server.js 2>/dev/null; then
    echo -e "${GREEN}✅ Backend server.js syntax is valid${NC}"
else
    echo -e "${RED}❌ Backend server.js has syntax errors${NC}"
    node -c server.js
fi

cd ../frontend
if [ -f "build/index.html" ]; then
    echo -e "${GREEN}✅ Frontend build/index.html exists${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend build/index.html missing${NC}"
fi

echo -e "\n${BLUE}6. Database connection test...${NC}"

# Check if PostgreSQL is running
if command -v psql >/dev/null 2>&1; then
    if pg_isready -q; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
        
        # Test database connection
        if psql -d simpledesk -c "SELECT 1;" >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Database 'simpledesk' is accessible${NC}"
        else
            echo -e "${YELLOW}⚠️  Database 'simpledesk' not accessible${NC}"
            echo "   Create database: createdb simpledesk"
        fi
    else
        echo -e "${YELLOW}⚠️  PostgreSQL not running${NC}"
        echo "   Start PostgreSQL: brew services start postgresql"
    fi
else
    echo -e "${YELLOW}⚠️  PostgreSQL not installed${NC}"
fi

echo -e "\n${BLUE}7. Quick fixes available:${NC}"
echo "   ./start-servers.sh     - Start both servers"
echo "   cd backend && npm install && node server.js"
echo "   cd frontend && npm install && npm run build && npx serve -s build -l 3000"

echo -e "\n${GREEN}Troubleshooting complete!${NC}"