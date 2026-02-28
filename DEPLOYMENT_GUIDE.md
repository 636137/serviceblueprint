# ServiceBlueprint Deployment Guide

## Production Deployment Checklist

### Prerequisites
- [ ] Node.js 14+ installed
- [ ] PostgreSQL or MongoDB database
- [ ] SSL certificate for HTTPS
- [ ] Domain name configured
- [ ] Environment variables configured
- [ ] Monitoring tools set up

---

## Environment Configuration

### Required Environment Variables

Create `.env` file:

```bash
# Server Configuration
NODE_ENV=production
PORT=3009
HOST=0.0.0.0

# Database (PostgreSQL example)
DATABASE_URL=postgresql://user:password@localhost:5432/serviceblueprint

# Security
API_KEY_SECRET=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/serviceblueprint/app.log

# Monitoring
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key
```

---

## Database Setup

### PostgreSQL Schema

```sql
-- Create database
CREATE DATABASE serviceblueprint;

-- Create tables
CREATE TABLE journeys (
  id SERIAL PRIMARY KEY,
  service_name VARCHAR(255) NOT NULL,
  touchpoints JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255),
  organization VARCHAR(255)
);

CREATE INDEX idx_journeys_service_name ON journeys(service_name);
CREATE INDEX idx_journeys_created_at ON journeys(created_at);

-- Create users table (for authentication)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  organization VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Create analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER REFERENCES journeys(id),
  event_type VARCHAR(50),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Deployment Options

### Option 1: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js serviceblueprint

# Create environment
eb create serviceblueprint-prod

# Deploy
eb deploy

# Configure environment variables
eb setenv NODE_ENV=production DATABASE_URL=...
```

### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3009

CMD ["node", "server.js"]
```

```bash
# Build
docker build -t serviceblueprint:latest .

# Run
docker run -d \
  -p 3009:3009 \
  --env-file .env \
  --name serviceblueprint \
  serviceblueprint:latest
```

### Option 3: Kubernetes

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: serviceblueprint
spec:
  replicas: 3
  selector:
    matchLabels:
      app: serviceblueprint
  template:
    metadata:
      labels:
        app: serviceblueprint
    spec:
      containers:
      - name: serviceblueprint
        image: serviceblueprint:latest
        ports:
        - containerPort: 3009
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
---
apiVersion: v1
kind: Service
metadata:
  name: serviceblueprint
spec:
  selector:
    app: serviceblueprint
  ports:
  - port: 80
    targetPort: 3009
  type: LoadBalancer
```

### Option 4: Traditional Server (PM2)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name serviceblueprint

# Configure auto-restart
pm2 startup
pm2 save

# Monitor
pm2 monit

# View logs
pm2 logs serviceblueprint
```

---

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name api.serviceblueprint.gov;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.serviceblueprint.gov;

    ssl_certificate /etc/ssl/certs/serviceblueprint.crt;
    ssl_certificate_key /etc/ssl/private/serviceblueprint.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:3009;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3009/api/health;
        access_log off;
    }
}
```

---

## Security Hardening

### 1. Enable HTTPS Only
```javascript
// Add to server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 2. Add Helmet for Security Headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 3. Add Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Add API Key Authentication
```javascript
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || !isValidApiKey(apiKey)) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

app.use('/api/', authenticateApiKey);
```

---

## Monitoring & Logging

### 1. Application Monitoring (New Relic)
```bash
npm install newrelic
```

```javascript
// Add to top of server.js
require('newrelic');
```

### 2. Error Tracking (Sentry)
```bash
npm install @sentry/node
```

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.errorHandler());
```

### 3. Structured Logging (Winston)
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## Performance Optimization

### 1. Enable Compression
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache template responses
app.get('/api/templates', async (req, res) => {
  const cached = await client.get('templates');
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const templates = getTemplates();
  await client.setex('templates', 3600, JSON.stringify(templates));
  res.json(templates);
});
```

### 3. Database Connection Pooling
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

---

## Backup & Recovery

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump serviceblueprint > /backups/serviceblueprint_$DATE.sql
aws s3 cp /backups/serviceblueprint_$DATE.sql s3://backups/serviceblueprint/

# Keep only last 30 days
find /backups -name "serviceblueprint_*.sql" -mtime +30 -delete
```

### Automated Backups (cron)
```bash
# Add to crontab
0 2 * * * /usr/local/bin/backup-serviceblueprint.sh
```

---

## Health Checks

### Kubernetes Liveness Probe
```yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3009
  initialDelaySeconds: 30
  periodSeconds: 10
```

### AWS ELB Health Check
```
Protocol: HTTP
Port: 3009
Path: /api/health
Healthy threshold: 2
Unhealthy threshold: 3
Timeout: 5 seconds
Interval: 30 seconds
```

---

## Scaling

### Horizontal Scaling
```bash
# PM2 cluster mode
pm2 start server.js -i max

# Kubernetes
kubectl scale deployment serviceblueprint --replicas=5
```

### Vertical Scaling
```bash
# Increase Node.js memory
node --max-old-space-size=4096 server.js
```

---

## Troubleshooting

### Common Issues

**Issue: High memory usage**
```bash
# Check memory
pm2 monit

# Restart if needed
pm2 restart serviceblueprint
```

**Issue: Slow database queries**
```sql
-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Add indexes
CREATE INDEX idx_journeys_created_at ON journeys(created_at);
```

**Issue: API timeouts**
```javascript
// Increase timeout
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  next();
});
```

---

## Rollback Procedure

```bash
# Docker
docker pull serviceblueprint:previous-version
docker stop serviceblueprint
docker run -d serviceblueprint:previous-version

# Kubernetes
kubectl rollout undo deployment/serviceblueprint

# PM2
pm2 stop serviceblueprint
git checkout previous-version
npm install
pm2 start server.js
```

---

## Post-Deployment Checklist

- [ ] Verify health check endpoint
- [ ] Test all API endpoints
- [ ] Check error logs
- [ ] Verify database connections
- [ ] Test authentication
- [ ] Verify SSL certificate
- [ ] Check monitoring dashboards
- [ ] Test backup restoration
- [ ] Verify rate limiting
- [ ] Load test application
- [ ] Update documentation
- [ ] Notify stakeholders

---

## Support Contacts

- **DevOps Team**: devops@agency.gov
- **Database Admin**: dba@agency.gov
- **Security Team**: security@agency.gov
- **On-Call**: +1-555-0100

---

**Last Updated:** 2026-02-28  
**Version:** 2.0.0
