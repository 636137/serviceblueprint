const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const journeys = [];
let journeyId = 1;

// Journey templates
const templates = {
  passport: {
    name: 'Passport Renewal',
    touchpoints: [
      { name: 'Research requirements', channel: 'web', duration: 15, satisfaction: 3 },
      { name: 'Fill application form', channel: 'web', duration: 30, satisfaction: 2 },
      { name: 'Schedule appointment', channel: 'phone', duration: 20, satisfaction: 2 },
      { name: 'Visit office', channel: 'office', duration: 45, satisfaction: 3 },
      { name: 'Submit documents', channel: 'office', duration: 15, satisfaction: 4 },
      { name: 'Track status', channel: 'web', duration: 5, satisfaction: 4 },
      { name: 'Receive passport', channel: 'mail', duration: 1, satisfaction: 5 }
    ]
  },
  benefits: {
    name: 'Apply for Benefits',
    touchpoints: [
      { name: 'Check eligibility', channel: 'web', duration: 10, satisfaction: 4 },
      { name: 'Gather documents', channel: 'offline', duration: 60, satisfaction: 2 },
      { name: 'Complete application', channel: 'web', duration: 45, satisfaction: 2 },
      { name: 'Submit application', channel: 'web', duration: 5, satisfaction: 4 },
      { name: 'Wait for review', channel: 'offline', duration: 1440, satisfaction: 2 },
      { name: 'Receive decision', channel: 'mail', duration: 1, satisfaction: 5 }
    ]
  },
  tax: {
    name: 'File Tax Return',
    touchpoints: [
      { name: 'Gather tax documents', channel: 'offline', duration: 30, satisfaction: 3 },
      { name: 'Choose filing method', channel: 'web', duration: 10, satisfaction: 4 },
      { name: 'Enter information', channel: 'web', duration: 60, satisfaction: 2 },
      { name: 'Review return', channel: 'web', duration: 15, satisfaction: 3 },
      { name: 'Submit return', channel: 'web', duration: 5, satisfaction: 4 },
      { name: 'Track refund', channel: 'web', duration: 5, satisfaction: 5 }
    ]
  }
};

// Get templates
app.get('/api/templates', (req, res) => {
  res.json(Object.keys(templates).map(key => ({
    id: key,
    name: templates[key].name,
    touchpointCount: templates[key].touchpoints.length
  })));
});

// Load template
app.get('/api/templates/:id', (req, res) => {
  const template = templates[req.params.id];
  if (template) {
    res.json(template);
  } else {
    res.status(404).json({ error: 'Template not found' });
  }
});

// Create journey map
app.post('/api/journey', (req, res) => {
  const journey = {
    id: journeyId++,
    ...req.body,
    createdAt: new Date()
  };
  journeys.push(journey);
  res.json(journey);
});

app.get('/api/journeys', (req, res) => {
  res.json(journeys);
});

app.get('/api/journeys/:id', (req, res) => {
  const journey = journeys.find(j => j.id === parseInt(req.params.id));
  if (journey) {
    res.json(journey);
  } else {
    res.status(404).json({ error: 'Journey not found' });
  }
});

// Analyze journey for pain points
app.post('/api/analyze', (req, res) => {
  const { serviceName, touchpoints } = req.body;
  
  const painPoints = [];
  const opportunities = [];
  const emotions = [];
  
  touchpoints.forEach((tp, index) => {
    // Satisfaction analysis
    if (tp.satisfaction <= 2) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        issue: 'Critical dissatisfaction',
        severity: 'critical',
        recommendation: 'Immediate redesign required'
      });
    } else if (tp.satisfaction === 3) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        issue: 'Neutral experience',
        severity: 'medium',
        recommendation: 'Improve user experience'
      });
    }
    
    // Duration analysis
    if (tp.duration > 60) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        issue: 'Excessive wait time (>60 min)',
        severity: 'high',
        recommendation: 'Streamline process or add automation'
      });
    } else if (tp.duration > 30) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        issue: 'Long wait time (>30 min)',
        severity: 'medium',
        recommendation: 'Consider optimization'
      });
    }
    
    // Opportunities
    if (tp.satisfaction >= 4) {
      opportunities.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        recommendation: 'Replicate best practices across other touchpoints'
      });
    }
    
    if (tp.duration < 10 && tp.satisfaction >= 4) {
      opportunities.push({
        step: index + 1,
        touchpoint: tp.name,
        channel: tp.channel,
        recommendation: 'Excellent efficiency - use as benchmark'
      });
    }
    
    // Emotional journey
    let emotion = 'neutral';
    if (tp.satisfaction >= 4) emotion = 'positive';
    if (tp.satisfaction <= 2) emotion = 'negative';
    emotions.push({ step: index + 1, emotion, score: tp.satisfaction });
  });
  
  // Calculate metrics
  const avgSatisfaction = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
  const totalDuration = touchpoints.reduce((sum, tp) => sum + tp.duration, 0);
  const channelBreakdown = {};
  touchpoints.forEach(tp => {
    channelBreakdown[tp.channel] = (channelBreakdown[tp.channel] || 0) + 1;
  });
  
  // Effort score (based on duration and satisfaction)
  const effortScore = touchpoints.reduce((sum, tp) => {
    return sum + (tp.duration * (6 - tp.satisfaction));
  }, 0) / touchpoints.length;
  
  // Journey health score (0-100)
  const healthScore = Math.round((avgSatisfaction / 5) * 100);
  
  res.json({
    serviceName,
    painPoints,
    opportunities,
    emotions,
    metrics: {
      averageSatisfaction: avgSatisfaction.toFixed(2),
      totalDuration,
      touchpointCount: touchpoints.length,
      channelBreakdown,
      effortScore: effortScore.toFixed(1),
      healthScore
    }
  });
});

// Compare journeys
app.post('/api/compare', (req, res) => {
  const { journey1, journey2 } = req.body;
  
  const calc = (tps) => ({
    avgSat: tps.reduce((s, t) => s + t.satisfaction, 0) / tps.length,
    totalDur: tps.reduce((s, t) => s + t.duration, 0),
    count: tps.length
  });
  
  const j1 = calc(journey1.touchpoints);
  const j2 = calc(journey2.touchpoints);
  
  res.json({
    journey1: { name: journey1.name, ...j1 },
    journey2: { name: journey2.name, ...j2 },
    comparison: {
      satisfactionDiff: (j1.avgSat - j2.avgSat).toFixed(2),
      durationDiff: j1.totalDur - j2.totalDur,
      winner: j1.avgSat > j2.avgSat ? journey1.name : journey2.name
    }
  });
});

const PORT = 3009;
app.listen(PORT, () => console.log(`ServiceBlueprint API on port ${PORT}`));
