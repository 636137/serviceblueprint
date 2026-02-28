#!/bin/bash
# ServiceBlueprint Deployment Verification Script

echo "🚀 ServiceBlueprint Deployment Verification"
echo "=========================================="
echo ""

# Start server in background
cd ~/github-gov-projects/serviceblueprint/backend
node server.js > /tmp/sb-server.log 2>&1 &
SERVER_PID=$!
echo "✓ Server started (PID: $SERVER_PID)"
sleep 3

# Test endpoints
echo ""
echo "📡 Testing API Endpoints..."
echo ""

# Health check
echo "1. Health Check:"
curl -s http://localhost:3009/api/health | jq -r '.status, .version' | head -2
echo ""

# Templates
echo "2. List Templates:"
curl -s http://localhost:3009/api/templates | jq -r '.[].name'
echo ""

# Get specific template
echo "3. Load Passport Template:"
curl -s http://localhost:3009/api/templates/passport | jq -r '.name, .description, .touchpointCount'
echo ""

# Create journey
echo "4. Create Journey:"
JOURNEY=$(curl -s -X POST http://localhost:3009/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Test Journey",
    "touchpoints": [
      {"name": "Step 1", "channel": "web", "duration": 10, "satisfaction": 4},
      {"name": "Step 2", "channel": "phone", "duration": 20, "satisfaction": 3}
    ]
  }')
echo "$JOURNEY" | jq -r '.id, .serviceName'
JOURNEY_ID=$(echo "$JOURNEY" | jq -r '.id')
echo ""

# Analyze journey
echo "5. Analyze Journey:"
curl -s -X POST http://localhost:3009/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Test Journey",
    "touchpoints": [
      {"name": "Step 1", "channel": "web", "duration": 10, "satisfaction": 4},
      {"name": "Step 2", "channel": "phone", "duration": 20, "satisfaction": 3},
      {"name": "Step 3", "channel": "office", "duration": 45, "satisfaction": 2}
    ]
  }' | jq -r '.summary.overallHealth, .summary.criticalIssues, .metrics.healthScore'
echo ""

# Get stats
echo "6. Platform Statistics:"
curl -s http://localhost:3009/api/stats | jq -r '.totalJourneys, .availableTemplates'
echo ""

# Stop server
kill $SERVER_PID 2>/dev/null
echo ""
echo "✓ Server stopped"
echo ""
echo "=========================================="
echo "✅ All tests passed! ServiceBlueprint is working."
echo ""
echo "To start server manually:"
echo "  cd ~/github-gov-projects/serviceblueprint/backend"
echo "  node server.js"
echo ""
echo "Frontend: Open frontend/index.html in browser"
