const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const journeys = [];
let journeyId = 1;

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

// Analyze journey for pain points
app.post('/api/analyze', (req, res) => {
  const { touchpoints } = req.body;
  
  const painPoints = [];
  const opportunities = [];
  
  touchpoints.forEach((tp, index) => {
    if (tp.satisfaction < 3) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        issue: 'Low satisfaction score',
        severity: 'high'
      });
    }
    
    if (tp.duration > 30) {
      painPoints.push({
        step: index + 1,
        touchpoint: tp.name,
        issue: 'Long wait time',
        severity: 'medium'
      });
    }
    
    if (tp.satisfaction >= 4) {
      opportunities.push({
        step: index + 1,
        touchpoint: tp.name,
        recommendation: 'Replicate best practices'
      });
    }
  });
  
  const avgSatisfaction = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
  const totalDuration = touchpoints.reduce((sum, tp) => sum + tp.duration, 0);
  
  res.json({
    painPoints,
    opportunities,
    metrics: {
      averageSatisfaction: avgSatisfaction.toFixed(2),
      totalDuration,
      touchpointCount: touchpoints.length
    }
  });
});

const PORT = 3009;
app.listen(PORT, () => console.log(`ServiceBlueprint API on port ${PORT}`));
