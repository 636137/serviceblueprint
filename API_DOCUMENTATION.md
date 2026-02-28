# ServiceBlueprint API Documentation

## Version 2.0.0

Enterprise-grade journey mapping and experience analysis platform for government services.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Examples](#examples)

---

## Getting Started

### Base URL
```
http://localhost:3009/api
```

### Installation
```bash
cd backend
npm install
npm start
```

### Health Check
```bash
curl http://localhost:3009/api/health
```

---

## Authentication

**Current Version:** No authentication required (development mode)

**Production:** Will require API key in header:
```
Authorization: Bearer YOUR_API_KEY
```

---

## API Endpoints

### 1. Health Check

**GET** `/api/health`

Check API server status and version.

**Response:**
```json
{
  "status": "healthy",
  "version": "2.0.0",
  "timestamp": "2026-02-28T05:30:00.000Z",
  "uptime": 3600
}
```

---

### 2. List Templates

**GET** `/api/templates`

Get all available journey templates.

**Response:**
```json
[
  {
    "id": "passport",
    "name": "Passport Renewal",
    "description": "Complete journey for renewing a U.S. passport",
    "category": "Identity Documents",
    "touchpointCount": 7,
    "estimatedTime": 131
  },
  {
    "id": "benefits",
    "name": "Apply for Benefits",
    "description": "Journey for applying for government assistance programs",
    "category": "Social Services",
    "touchpointCount": 6,
    "estimatedTime": 1561
  }
]
```

---

### 3. Get Template

**GET** `/api/templates/:id`

Load a specific journey template.

**Parameters:**
- `id` (string) - Template identifier (passport, benefits, tax, license)

**Response:**
```json
{
  "name": "Passport Renewal",
  "description": "Complete journey for renewing a U.S. passport",
  "category": "Identity Documents",
  "estimatedTime": 131,
  "touchpoints": [
    {
      "name": "Research requirements",
      "channel": "web",
      "duration": 15,
      "satisfaction": 3,
      "description": "Visit travel.state.gov to understand renewal requirements"
    }
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Template not found",
  "availableTemplates": ["passport", "benefits", "tax", "license"]
}
```

---

### 4. Create Journey

**POST** `/api/journey`

Save a new journey map.

**Request Body:**
```json
{
  "serviceName": "Passport Renewal",
  "touchpoints": [
    {
      "name": "Research requirements",
      "channel": "web",
      "duration": 15,
      "satisfaction": 3
    },
    {
      "name": "Fill application",
      "channel": "web",
      "duration": 30,
      "satisfaction": 2
    }
  ]
}
```

**Response (201):**
```json
{
  "id": 1,
  "serviceName": "Passport Renewal",
  "touchpoints": [...],
  "createdAt": "2026-02-28T05:30:00.000Z",
  "updatedAt": "2026-02-28T05:30:00.000Z"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid journey data",
  "validationErrors": [
    "Service name is required and must be a string",
    "Touchpoint 1: Duration must be a positive number"
  ]
}
```

---

### 5. List Journeys

**GET** `/api/journeys`

Get all saved journeys with pagination.

**Query Parameters:**
- `limit` (number, optional) - Maximum journeys to return (default: 100)
- `offset` (number, optional) - Number of journeys to skip (default: 0)

**Response:**
```json
{
  "journeys": [
    {
      "id": 1,
      "serviceName": "Passport Renewal",
      "touchpoints": [...],
      "createdAt": "2026-02-28T05:30:00.000Z"
    }
  ],
  "total": 10,
  "limit": 100,
  "offset": 0
}
```

---

### 6. Get Journey

**GET** `/api/journeys/:id`

Get a specific journey by ID.

**Parameters:**
- `id` (number) - Journey identifier

**Response:**
```json
{
  "id": 1,
  "serviceName": "Passport Renewal",
  "touchpoints": [...],
  "createdAt": "2026-02-28T05:30:00.000Z",
  "updatedAt": "2026-02-28T05:30:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Journey not found"
}
```

---

### 7. Delete Journey

**DELETE** `/api/journeys/:id`

Delete a journey by ID.

**Parameters:**
- `id` (number) - Journey identifier

**Response:**
```json
{
  "message": "Journey deleted successfully"
}
```

---

### 8. Analyze Journey

**POST** `/api/analyze`

Analyze a journey and generate comprehensive insights.

**Request Body:**
```json
{
  "serviceName": "Passport Renewal",
  "touchpoints": [
    {
      "name": "Research requirements",
      "channel": "web",
      "duration": 15,
      "satisfaction": 3
    },
    {
      "name": "Fill application",
      "channel": "web",
      "duration": 30,
      "satisfaction": 2
    }
  ]
}
```

**Response:**
```json
{
  "serviceName": "Passport Renewal",
  "summary": {
    "overallHealth": "Fair",
    "criticalIssues": 1,
    "highPriorityActions": 1,
    "keyStrength": "Track status",
    "primaryConcern": "Fill application"
  },
  "painPoints": [
    {
      "step": 2,
      "touchpoint": "Fill application",
      "channel": "web",
      "issue": "Critical dissatisfaction",
      "severity": "critical",
      "recommendation": "Immediate redesign required - conduct user research to identify root causes",
      "impact": "high",
      "priority": 1
    }
  ],
  "opportunities": [
    {
      "step": 6,
      "touchpoint": "Track status",
      "channel": "web",
      "recommendation": "Excellent efficiency - use as benchmark for other touchpoints",
      "type": "benchmark",
      "potentialImpact": "high"
    }
  ],
  "emotions": [
    {
      "step": 1,
      "emotion": "neutral",
      "score": 3,
      "touchpoint": "Research requirements"
    }
  ],
  "recommendations": [
    {
      "step": 2,
      "type": "critical",
      "action": "Redesign \"Fill application\" touchpoint",
      "rationale": "Satisfaction score of 2/5 indicates severe user frustration",
      "estimatedImpact": "High - could improve overall journey satisfaction by 15-20%"
    }
  ],
  "metrics": {
    "averageSatisfaction": "3.43",
    "totalDuration": 131,
    "touchpointCount": 7,
    "channelBreakdown": {
      "web": 4,
      "phone": 1,
      "office": 2
    },
    "effortScore": "42.3",
    "healthScore": 69,
    "completionRate": 72,
    "satisfactionTrend": "improving",
    "bottlenecks": [
      {
        "step": 4,
        "touchpoint": "Visit office",
        "duration": 45,
        "percentOfTotal": 34
      }
    ]
  },
  "timestamp": "2026-02-28T05:30:00.000Z"
}
```

---

### 9. Compare Journeys

**POST** `/api/compare`

Compare two journeys side-by-side.

**Request Body:**
```json
{
  "journey1": {
    "name": "Current Process",
    "touchpoints": [...]
  },
  "journey2": {
    "name": "Optimized Process",
    "touchpoints": [...]
  }
}
```

**Response:**
```json
{
  "journey1": {
    "name": "Current Process",
    "avgSat": 3.2,
    "totalDur": 150,
    "count": 8,
    "healthScore": 64
  },
  "journey2": {
    "name": "Optimized Process",
    "avgSat": 4.1,
    "totalDur": 90,
    "count": 6,
    "healthScore": 82
  },
  "comparison": {
    "satisfactionDiff": "-0.90",
    "durationDiff": 60,
    "healthScoreDiff": -18,
    "winner": "Optimized Process",
    "recommendation": "Optimized Process provides better user experience"
  }
}
```

---

### 10. Get Statistics

**GET** `/api/stats`

Get platform-wide statistics.

**Response:**
```json
{
  "totalJourneys": 25,
  "totalTouchpoints": 180,
  "avgTouchpointsPerJourney": "7.2",
  "availableTemplates": 4,
  "timestamp": "2026-02-28T05:30:00.000Z"
}
```

---

## Data Models

### Touchpoint

```typescript
{
  name: string;           // Touchpoint name (required)
  channel: string;        // web | mobile | phone | office | mail | offline (required)
  duration: number;       // Duration in minutes (required, >= 0)
  satisfaction: number;   // Satisfaction score 1-5 (required)
  description?: string;   // Optional description
}
```

### Journey

```typescript
{
  id?: number;                    // Auto-generated
  serviceName: string;            // Service name (required)
  touchpoints: Touchpoint[];      // Array of touchpoints (required, min 1)
  createdAt?: string;             // ISO timestamp (auto-generated)
  updatedAt?: string;             // ISO timestamp (auto-generated)
}
```

### Analysis Result

```typescript
{
  serviceName: string;
  summary: {
    overallHealth: string;        // Excellent | Good | Fair | Poor
    criticalIssues: number;
    highPriorityActions: number;
    keyStrength: string;
    primaryConcern: string;
  };
  painPoints: PainPoint[];
  opportunities: Opportunity[];
  emotions: Emotion[];
  recommendations: Recommendation[];
  metrics: Metrics;
  timestamp: string;
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "timestamp": "2026-02-28T05:30:00.000Z"
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

**Current:** No rate limiting (development mode)

**Production:** 
- 100 requests per minute per IP
- 1000 requests per hour per API key

---

## Examples

### Example 1: Create and Analyze Journey

```bash
# Create journey
curl -X POST http://localhost:3009/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Tax Filing",
    "touchpoints": [
      {"name": "Gather documents", "channel": "offline", "duration": 30, "satisfaction": 3},
      {"name": "Enter information", "channel": "web", "duration": 60, "satisfaction": 2},
      {"name": "Submit return", "channel": "web", "duration": 5, "satisfaction": 4}
    ]
  }'

# Analyze journey
curl -X POST http://localhost:3009/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Tax Filing",
    "touchpoints": [
      {"name": "Gather documents", "channel": "offline", "duration": 30, "satisfaction": 3},
      {"name": "Enter information", "channel": "web", "duration": 60, "satisfaction": 2},
      {"name": "Submit return", "channel": "web", "duration": 5, "satisfaction": 4}
    ]
  }'
```

### Example 2: Load Template and Modify

```bash
# Get template
curl http://localhost:3009/api/templates/passport

# Modify and save as new journey
curl -X POST http://localhost:3009/api/journey \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "Passport Renewal - Optimized",
    "touchpoints": [...]
  }'
```

### Example 3: Compare Before/After

```bash
curl -X POST http://localhost:3009/api/compare \
  -H "Content-Type: application/json" \
  -d '{
    "journey1": {
      "name": "Before Optimization",
      "touchpoints": [...]
    },
    "journey2": {
      "name": "After Optimization",
      "touchpoints": [...]
    }
  }'
```

---

## Support

- **GitHub**: https://github.com/636137/serviceblueprint
- **Issues**: https://github.com/636137/serviceblueprint/issues
- **Documentation**: See README.md

---

## Changelog

### v2.0.0 (2026-02-28)
- Added comprehensive validation
- Enhanced analysis with recommendations
- Added 4 journey templates
- Improved error handling
- Added statistics endpoint
- Added journey comparison
- Added comprehensive documentation

### v1.0.0 (2026-02-28)
- Initial release
- Basic journey mapping
- Simple analysis

---

**Last Updated:** 2026-02-28  
**API Version:** 2.0.0
