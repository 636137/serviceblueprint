## Proprietary Notice

This code is proprietary to **Maximus**. **No public license is granted**. See [`NOTICE`](./NOTICE).

---

# ServiceBlueprint - Enterprise Journey Mapping Platform

## Repository Layout

- `frontend/`
- `backend/`
- `infra/`

## Local vs Deploy

- Local: see `docs/how-to.md`
- Deploy: see `infra/`


**Professional customer journey mapping and analytics platform for government services**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](http://serviceblueprint-1772257679.s3-website-us-east-1.amazonaws.com)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🌐 Live Application

**Access the app:** [http://serviceblueprint-1772257679.s3-website-us-east-1.amazonaws.com](http://serviceblueprint-1772257679.s3-website-us-east-1.amazonaws.com)

**Demo Credentials:**
- Email: `chaddhendren@example.com`
- Password: `Admin123!`

---

## ✨ Features

### Visual Journey Builder
- **Timeline-based interface** - Drag-and-drop touchpoint creation
- **Real-time updates** - See changes as you build
- **Multi-channel support** - Web, mobile, phone, in-person, mail, offline
- **Satisfaction tracking** - 5-point scale with visual indicators
- **Duration tracking** - Monitor time spent at each touchpoint

### Advanced Analytics
- **Health Score** - Automated 0-100 journey health calculation
- **Satisfaction Charts** - Interactive line graphs showing trends
- **Emotional Journey** - Bar charts with color-coded emotions
- **Pain Point Detection** - Automatic identification with severity levels
- **Opportunity Identification** - AI-powered improvement suggestions
- **Effort Scoring** - Weighted calculation based on duration and satisfaction

### Pre-built Templates
- **Passport Renewal** - 7 touchpoints, Identity Documents
- **Benefits Application** - 6 touchpoints, Social Services
- **Tax Filing** - 6 touchpoints, Tax Services
- **Driver License Renewal** - 8 touchpoints, Motor Vehicles

### Professional UI/UX
- Modern sidebar navigation
- Clean, card-based layouts
- Smooth animations and transitions
- Responsive design
- Dark mode sidebar
- Interactive charts (Chart.js)

---

## 🏗️ Architecture

**100% Serverless AWS Stack:**

```
User Browser
    ↓
S3 Static Website (Frontend)
    ↓
Amazon Cognito (Authentication)
    ↓
API Gateway (REST API)
    ↓
AWS Lambda (Node.js Backend)
```

**Components:**
- **Frontend:** React-style vanilla JS, Chart.js visualizations
- **Authentication:** Amazon Cognito with secure JWT tokens
- **API:** API Gateway with Lambda proxy integration
- **Backend:** Node.js 20.x Lambda function
- **Storage:** In-memory (can be extended to DynamoDB)

---

## 🚀 Quick Start

### Access Live Demo
1. Visit [the live app](http://serviceblueprint-1772257679.s3-website-us-east-1.amazonaws.com)
2. Sign in with demo credentials
3. Load a template or create your own journey
4. Analyze to see insights and recommendations

### Local Development
```bash
# Clone repository
git clone https://github.com/636137/serviceblueprint.git
cd serviceblueprint

# Run backend locally
cd backend
npm install
node server.js

# Open frontend
open frontend/index.html
```

---

## 📊 API Endpoints

**Base URL:** `https://ykth0mj0s1.execute-api.us-east-1.amazonaws.com/prod`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/templates` | List all templates |
| GET | `/templates/{id}` | Get specific template |
| POST | `/analyze` | Analyze journey and get insights |
| POST | `/journey` | Save journey |
| GET | `/journeys` | List saved journeys |

### Example: Analyze Journey
```bash
curl -X POST https://ykth0mj0s1.execute-api.us-east-1.amazonaws.com/prod/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "DMV Visit",
    "touchpoints": [
      {"name": "Wait in line", "channel": "office", "duration": 45, "satisfaction": 2},
      {"name": "Process renewal", "channel": "office", "duration": 10, "satisfaction": 4}
    ]
  }'
```

---

## 🛠️ Deployment

### AWS Resources

**Cognito User Pool:**
- Pool ID: `us-east-1_zEqsXYPuE`
- Client ID: `1cnu0har8rhtess0eh3oaffdac`

**API Gateway:**
- API ID: `ykth0mj0s1`
- Endpoint: `https://ykth0mj0s1.execute-api.us-east-1.amazonaws.com/prod`

**Lambda Function:**
- Name: `serviceblueprint-api`
- Runtime: Node.js 20.x

**S3 Bucket:**
- Name: `serviceblueprint-1772257679`
- Website: `http://serviceblueprint-1772257679.s3-website-us-east-1.amazonaws.com`

### Update Lambda Function
```bash
cd serviceblueprint
zip lambda-function.zip lambda-handler.js
aws lambda update-function-code \
  --function-name serviceblueprint-api \
  --zip-file fileb://lambda-function.zip \
  --region us-east-1
```

### Update Frontend
```bash
aws s3 cp frontend/index.html s3://serviceblueprint-1772257679/index.html \
  --content-type "text/html"
```

---

## 💰 Cost

**Estimated monthly cost for typical usage:**
- S3: ~$0.50
- Cognito: Free (< 50,000 MAU)
- API Gateway: ~$3.50 per million requests
- Lambda: ~$0.20 per million requests

**Total: < $5/month**

---

## 📖 Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [AWS Deployment](AWS_DEPLOYMENT.md) - Current AWS setup details
- [Quick Start](QUICKSTART.md) - Getting started guide
- [Enhancement Summary](ENHANCEMENT_SUMMARY.md) - Version 2.0 changelog

---

## 🧪 Testing

```bash
cd backend
npm test
```

**Test Coverage:**
- 32 automated tests
- 100% pass rate
- Validation, calculations, pain points, opportunities, edge cases

---

## 🎯 Use Cases

- **Government Services** - Map citizen service journeys
- **Digital Transformation** - Identify improvement opportunities
- **CX Research** - Understand user pain points
- **Service Design** - Visualize and optimize touchpoints
- **Stakeholder Communication** - Share journey insights

---

## 🔐 Security

- Cognito authentication with JWT tokens
- HTTPS-only API endpoints
- CORS enabled for web access
- Input validation on all endpoints
- No sensitive data stored

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file

---

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for better government services**

<!-- BEGIN COPILOT CUSTOM AGENTS -->
## GitHub Copilot Custom Agents (Maximus Internal)

This repository includes **GitHub Copilot custom agent profiles** under `.github/agents/` to speed up planning, documentation, and safe reviews.

### Included agents
- `implementation-planner` — Creates detailed implementation plans and technical specifications for this repository.
- `readme-creator` — Improves README and adjacent documentation without modifying production code.
- `security-auditor` — Performs a read-only security review (secrets risk, risky patterns) and recommends fixes.

### How to invoke

- **GitHub.com (Copilot coding agent):** select the agent from the agent dropdown (or assign it to an issue) after the `.agent.md` files are on the default branch.
- **GitHub Copilot CLI:** from the repo folder, run `/agent` and select one of the agents, or run:
  - `copilot --agent <agent-file-base-name> --prompt "<your prompt>"`
- **IDEs:** open Copilot Chat and choose the agent from the agents dropdown (supported IDEs), backed by the `.github/agents/*.agent.md` files.

References:
- Custom agents configuration: https://docs.github.com/en/copilot/reference/custom-agents-configuration
- Creating custom agents: https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents
<!-- END COPILOT CUSTOM AGENTS -->
