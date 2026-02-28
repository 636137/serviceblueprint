# ServiceBlueprint - Enterprise Journey Mapping Platform

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/636137/serviceblueprint)
[![Tests](https://img.shields.io/badge/tests-32%20passed-success.svg)](https://github.com/636137/serviceblueprint)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Enterprise-grade journey mapping and experience analysis platform for government services.**

---

## 🎯 Overview

ServiceBlueprint helps government agencies visualize, analyze, and optimize citizen service journeys across all touchpoints. Built with comprehensive validation, error handling, testing, and documentation for production deployment.

### Key Features

✅ **Journey Mapping** - Visual touchpoint mapping with multi-channel support  
✅ **Pre-built Templates** - 4 government service templates ready to use  
✅ **Advanced Analytics** - Health scores, effort metrics, emotional journey  
✅ **Pain Point Detection** - Automatic identification with severity levels  
✅ **Opportunity Identification** - Best practice recommendations  
✅ **Comprehensive Testing** - 32 automated tests with 100% pass rate  
✅ **Enterprise Documentation** - API docs, deployment guide, inline comments  
✅ **Production Ready** - Error handling, validation, logging, monitoring  

---

## 🚀 Quick Start

### Installation

```bash
cd backend
npm install
npm start
```

Server runs on `http://localhost:3009`

### Run Tests

```bash
npm test
```

### Load a Template

```bash
curl http://localhost:3009/api/templates/passport
```

---

## 📊 What's Included

### Backend API (`/backend`)
- **server.js** - Main API server with comprehensive error handling
- **test.js** - 32 automated tests covering all functionality
- **package.json** - Dependencies and scripts

### Documentation
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **DEPLOYMENT_GUIDE.md** - Production deployment instructions
- **ENHANCED_README.md** - Feature guide and use cases
- **ENHANCEMENT_SUMMARY.md** - What changed in v2.0

### Frontend (`/frontend`)
- **index.html** - Modern UI with tabs, charts, and analytics

---

## 📋 Pre-built Templates

### 1. Passport Renewal (7 touchpoints)
Complete journey for renewing a U.S. passport
- Research → Application → Appointment → Office Visit → Submission → Tracking → Receipt
- Estimated time: 131 minutes
- Category: Identity Documents

### 2. Benefits Application (6 touchpoints)
Journey for applying for government assistance programs
- Eligibility → Documents → Application → Submission → Review → Decision
- Estimated time: 1561 minutes (26 hours)
- Category: Social Services

### 3. Tax Filing (6 touchpoints)
Individual income tax filing journey
- Gather Docs → Choose Method → Enter Info → Review → Submit → Track Refund
- Estimated time: 125 minutes
- Category: Tax Services

### 4. Driver License Renewal (8 touchpoints)
DMV driver license renewal process
- Notice → Check Options → Schedule → Visit DMV → Vision Test → Pay → Temp License → Permanent License
- Estimated time: 95 minutes
- Category: Motor Vehicles

---

## 🎨 Features in Detail

### Journey Health Score (0-100)
Automated calculation based on satisfaction metrics:
- **80-100**: Excellent - Best-in-class experience
- **60-79**: Good - Solid performance
- **40-59**: Fair - Needs improvement
- **0-39**: Poor - Critical issues

### Pain Point Detection
Automatic identification with 3 severity levels:
- **Critical** - Satisfaction ≤ 2 (immediate action required)
- **High** - Duration > 60 minutes (streamline needed)
- **Medium** - Satisfaction = 3 or duration > 30 minutes

### Advanced Metrics
- Average Satisfaction
- Total Duration
- Effort Score (weighted by dissatisfaction)
- Channel Breakdown
- Completion Rate Estimate
- Satisfaction Trend
- Bottleneck Identification

### Emotional Journey
Visual bar chart showing satisfaction at each step with color-coded emotions:
- 🟢 Positive (satisfaction ≥ 4)
- 🟡 Neutral (satisfaction = 3)
- 🔴 Negative (satisfaction ≤ 2)

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/templates` | List all templates |
| GET | `/api/templates/:id` | Get specific template |
| POST | `/api/journey` | Create journey |
| GET | `/api/journeys` | List journeys (paginated) |
| GET | `/api/journeys/:id` | Get journey by ID |
| DELETE | `/api/journeys/:id` | Delete journey |
| POST | `/api/analyze` | Analyze journey |
| POST | `/api/compare` | Compare two journeys |
| GET | `/api/stats` | Platform statistics |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete reference.

---

## 🧪 Testing

### Test Coverage
- ✅ 8 Validation tests
- ✅ 5 Calculation tests
- ✅ 4 Pain point detection tests
- ✅ 3 Opportunity detection tests
- ✅ 3 Emotional journey tests
- ✅ 5 Edge case tests
- ✅ 4 Template tests

**Total: 32 tests, 100% pass rate**

### Run Tests
```bash
cd backend
npm test
```

---

## 📖 Documentation

### For Developers
- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment
- Inline code comments throughout

### For Users
- [Enhanced README](ENHANCED_README.md) - Feature guide and examples
- [Enhancement Summary](ENHANCEMENT_SUMMARY.md) - What's new in v2.0

---

## 🏗️ Architecture

### Technology Stack
- **Backend**: Node.js + Express.js
- **Validation**: Custom validation functions
- **Testing**: Native Node.js assertions
- **Documentation**: Markdown + JSDoc comments

### Data Models
```javascript
Touchpoint {
  name: string
  channel: 'web' | 'mobile' | 'phone' | 'office' | 'mail' | 'offline'
  duration: number (minutes)
  satisfaction: 1-5
  description?: string
}

Journey {
  serviceName: string
  touchpoints: Touchpoint[]
}
```

---

## 🚢 Deployment

### Quick Deploy (PM2)
```bash
npm install -g pm2
pm2 start server.js --name serviceblueprint
pm2 save
```

### Docker
```bash
docker build -t serviceblueprint .
docker run -p 3009:3009 serviceblueprint
```

### Production
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- Environment configuration
- Database setup
- Security hardening
- Monitoring & logging
- Scaling strategies
- Backup procedures

---

## 📊 Example Usage

### Analyze a Journey
```bash
curl -X POST http://localhost:3009/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Passport Renewal",
    "touchpoints": [
      {"name": "Research", "channel": "web", "duration": 15, "satisfaction": 3},
      {"name": "Apply", "channel": "web", "duration": 30, "satisfaction": 2},
      {"name": "Submit", "channel": "office", "duration": 45, "satisfaction": 4}
    ]
  }'
```

---

## 🎓 Training Resources

### Quick Start Tutorial
1. Open `frontend/index.html` in browser
2. Click "Templates" tab
3. Select "Passport Renewal"
4. Click "Journey Builder" to view touchpoints
5. Click "Analyze Journey" to see insights

---

## 📈 Roadmap

### v2.1 (Q2 2026)
- [ ] Real-time collaboration
- [ ] PDF/PowerPoint export
- [ ] Advanced visualizations
- [ ] Integration with analytics platforms

### v3.0 (Q3 2026)
- [ ] AI-powered recommendations
- [ ] Predictive analytics
- [ ] Mobile app
- [ ] Multi-language support

---

## 🏆 Success Metrics

### Platform Statistics
- 4 pre-built templates
- 32 automated tests (100% pass)
- 10+ comprehensive metrics
- 2,000+ lines of documented code
- Enterprise-grade error handling

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/636137/serviceblueprint/issues)
- **Documentation**: See docs folder

---

## 📄 License

MIT License

---

**🚀 Ready for Production Deployment**

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) to get started.

---

**Last Updated**: 2026-02-28  
**Repository**: https://github.com/636137/serviceblueprint
