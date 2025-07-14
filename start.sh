#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Rent and Return Application${NC}"

# Start PostgreSQL container
echo -e "${YELLOW}📦 Starting PostgreSQL container...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
sleep 10

# Start backend in background
echo -e "${YELLOW}🌐 Starting backend server...${NC}"
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 30

# Start frontend in background
echo -e "${YELLOW}🎨 Starting frontend server...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Application started successfully!${NC}"
echo -e "${GREEN}🔗 Backend: http://localhost:8080${NC}"
echo -e "${GREEN}🔗 Frontend: http://localhost:5173${NC}"
echo -e "${YELLOW}📋 To stop the application, run: kill $BACKEND_PID $FRONTEND_PID${NC}"

# Keep script running
wait
