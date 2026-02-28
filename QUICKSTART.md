# ServiceBlueprint - Quick Start Guide

## ✅ Deployment Verified!

ServiceBlueprint is fully functional and ready to use.

---

## 🚀 Start the Server

```bash
cd ~/github-gov-projects/serviceblueprint/backend
node server.js
```

Server will start on **http://localhost:3009**

---

## 🧪 Run Tests

```bash
cd ~/github-gov-projects/serviceblueprint/backend
npm test
```

**Result:** 32 tests, 100% pass rate ✅

---

## 📊 Try the API

### 1. Health Check
```bash
curl http://localhost:3009/api/health
```

### 2. List Templates
```bash
curl http://localhost:3009/api/templates
```

### 3. Load Passport Template
```bash
curl http://localhost:3009/api/templates/passport | jq
```

### 4. Analyze a Journey
```bash
curl -X POST http://localhost:3009/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Passport Renewal",
    "touchpoints": [
      {"name": "Research", "channel": "web", "duration": 15, "satisfaction": 3},
      {"name": "Apply", "channel": "web", "duration": 30, "satisfaction": 2},
      {"name": "Visit Office", "channel": "office", "duration": 45, "satisfaction": 3},
      {"name": "Submit", "channel": "office", "duration": 15, "satisfaction": 4},
      {"name": "Track", "channel": "web", "duration": 5, "satisfaction": 4},
      {"name": "Receive", "channel": "mail", "duration": 1, "satisfaction": 5}
    ]
  }' | jq
```

---

## 🎨 Use the Frontend

1. Start the backend server (see above)
2. Open `frontend/index.html` in your browser
3. Click "Templates" tab
4. Select "Passport Renewal"
5. Click "Analyze Journey"
6. Explore the insights!

---

## 📋 Available Templates

1. **Passport Renewal** (7 touchpoints, 131 min)
2. **Apply for Benefits** (6 touchpoints, 1561 min)
3. **File Tax Return** (6 touchpoints, 125 min)
4. **Renew Driver License** (8 touchpoints, 95 min)

---

## 🔍 Verify Deployment

Run the verification script:
```bash
~/github-gov-projects/serviceblueprint/verify-deployment.sh
```

This will:
- Start the server
- Test all endpoints
- Create a test journey
- Analyze it
- Stop the server
- Report results

---

## 📖 Documentation

- **API Reference**: `API_DOCUMENTATION.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Feature Guide**: `ENHANCED_README.md`
- **What's New**: `ENHANCEMENT_SUMMARY.md`

---

## 🎯 Example Workflow

### Create and Analyze a Journey

```bash
# 1. Start server
cd ~/github-gov-projects/serviceblueprint/backend
node server.js &

# 2. Create journey
curl -X POST http://localhost:3009/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "DMV Visit",
    "touchpoints": [
      {"name": "Schedule online", "channel": "web", "duration": 15, "satisfaction": 4},
      {"name": "Wait in line", "channel": "office", "duration": 45, "satisfaction": 2},
      {"name": "Process renewal", "channel": "office", "duration": 10, "satisfaction": 3},
      {"name": "Receive temp license", "channel": "office", "duration": 5, "satisfaction": 4}
    ]
  }'

# 3. Analyze it
curl -X POST http://localhost:3009/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "DMV Visit",
    "touchpoints": [
      {"name": "Schedule online", "channel": "web", "duration": 15, "satisfaction": 4},
      {"name": "Wait in line", "channel": "office", "duration": 45, "satisfaction": 2},
      {"name": "Process renewal", "channel": "office", "duration": 10, "satisfaction": 3},
      {"name": "Receive temp license", "channel": "office", "duration": 5, "satisfaction": 4}
    ]
  }' | jq '.summary, .painPoints[0], .metrics.healthScore'

# 4. Stop server
pkill -f "node server.js"
```

---

## 🏆 What You Get

✅ **Working API** - 10 endpoints fully functional  
✅ **4 Templates** - Ready-to-use government journeys  
✅ **Advanced Analytics** - Health scores, pain points, opportunities  
✅ **32 Tests** - All passing  
✅ **Complete Docs** - API, deployment, features  
✅ **Modern UI** - Interactive journey builder  

---

## 🚀 Production Deployment

For production deployment, see `DEPLOYMENT_GUIDE.md` for:
- Docker deployment
- Kubernetes setup
- AWS/Azure deployment
- Security hardening
- Monitoring setup
- Database configuration

---

## 📞 Support

- **GitHub**: https://github.com/636137/serviceblueprint
- **Issues**: Report bugs or request features
- **Docs**: See documentation files

---

**Status**: ✅ Deployed and Working  
**Version**: 2.0.0  
**Last Verified**: 2026-02-28
