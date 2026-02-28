const templates = {
  passport: {
    id: 'passport',
    name: 'Passport Renewal',
    description: 'Standard passport renewal journey for U.S. citizens',
    category: 'Identity Documents',
    estimatedDuration: 131,
    touchpointCount: 7,
    serviceName: 'Passport Renewal',
    touchpoints: [
      { name: 'Find information online', channel: 'web', duration: 15, satisfaction: 4 },
      { name: 'Download forms', channel: 'web', duration: 5, satisfaction: 3 },
      { name: 'Fill out application', channel: 'offline', duration: 20, satisfaction: 3 },
      { name: 'Get passport photo', channel: 'office', duration: 30, satisfaction: 2 },
      { name: 'Mail application', channel: 'mail', duration: 15, satisfaction: 3 },
      { name: 'Wait for processing', channel: 'offline', duration: 20160, satisfaction: 2 },
      { name: 'Receive passport', channel: 'mail', duration: 1, satisfaction: 5 }
    ]
  },
  benefits: {
    id: 'benefits',
    name: 'Benefits Application',
    description: 'Social services benefits application process',
    category: 'Social Services',
    estimatedDuration: 1561,
    touchpointCount: 6,
    serviceName: 'Benefits Application',
    touchpoints: [
      { name: 'Learn about eligibility', channel: 'web', duration: 30, satisfaction: 3 },
      { name: 'Create account', channel: 'web', duration: 10, satisfaction: 3 },
      { name: 'Complete application', channel: 'web', duration: 45, satisfaction: 2 },
      { name: 'Upload documents', channel: 'web', duration: 20, satisfaction: 2 },
      { name: 'Phone interview', channel: 'phone', duration: 30, satisfaction: 3 },
      { name: 'Wait for decision', channel: 'offline', duration: 43200, satisfaction: 2 }
    ]
  },
  tax: {
    id: 'tax',
    name: 'Tax Filing',
    description: 'Individual income tax filing process',
    category: 'Tax Services',
    estimatedDuration: 125,
    touchpointCount: 6,
    serviceName: 'Tax Filing',
    touchpoints: [
      { name: 'Gather documents', channel: 'offline', duration: 30, satisfaction: 3 },
      { name: 'Choose filing method', channel: 'web', duration: 10, satisfaction: 4 },
      { name: 'Enter information', channel: 'web', duration: 60, satisfaction: 3 },
      { name: 'Review return', channel: 'web', duration: 15, satisfaction: 4 },
      { name: 'Submit return', channel: 'web', duration: 5, satisfaction: 4 },
      { name: 'Receive confirmation', channel: 'web', duration: 5, satisfaction: 5 }
    ]
  },
  license: {
    id: 'license',
    name: 'Driver License Renewal',
    description: 'Standard driver license renewal at DMV',
    category: 'Motor Vehicles',
    estimatedDuration: 95,
    touchpointCount: 8,
    serviceName: 'Driver License Renewal',
    touchpoints: [
      { name: 'Receive renewal notice', channel: 'mail', duration: 1, satisfaction: 4 },
      { name: 'Check requirements online', channel: 'web', duration: 10, satisfaction: 4 },
      { name: 'Schedule appointment', channel: 'web', duration: 5, satisfaction: 3 },
      { name: 'Travel to DMV', channel: 'offline', duration: 20, satisfaction: 3 },
      { name: 'Wait in line', channel: 'office', duration: 45, satisfaction: 1 },
      { name: 'Vision test', channel: 'office', duration: 5, satisfaction: 4 },
      { name: 'Pay fee', channel: 'office', duration: 5, satisfaction: 3 },
      { name: 'Receive temporary license', channel: 'office', duration: 4, satisfaction: 4 }
    ]
  }
};

function validateTouchpoint(tp) {
  const errors = [];
  if (!tp.name || typeof tp.name !== 'string') errors.push('Touchpoint name is required');
  if (!['web', 'mobile', 'phone', 'office', 'mail', 'offline'].includes(tp.channel)) {
    errors.push('Invalid channel');
  }
  if (typeof tp.duration !== 'number' || tp.duration < 0) errors.push('Duration must be >= 0');
  if (typeof tp.satisfaction !== 'number' || tp.satisfaction < 1 || tp.satisfaction > 5) {
    errors.push('Satisfaction must be 1-5');
  }
  return { isValid: errors.length === 0, errors };
}

function validateJourney(journey) {
  const errors = [];
  if (!journey.serviceName || typeof journey.serviceName !== 'string') {
    errors.push('Service name is required');
  }
  if (!Array.isArray(journey.touchpoints) || journey.touchpoints.length === 0) {
    errors.push('At least one touchpoint is required');
  } else {
    journey.touchpoints.forEach((tp, i) => {
      const validation = validateTouchpoint(tp);
      if (!validation.isValid) {
        errors.push(`Touchpoint ${i + 1}: ${validation.errors.join(', ')}`);
      }
    });
  }
  return { isValid: errors.length === 0, errors };
}

function analyzeJourney(journey) {
  const touchpoints = journey.touchpoints;
  const totalDuration = touchpoints.reduce((sum, tp) => sum + tp.duration, 0);
  const avgSatisfaction = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
  const lowSatisfaction = touchpoints.filter(tp => tp.satisfaction <= 2);
  const effortScore = touchpoints.reduce((sum, tp) => sum + (tp.duration * (6 - tp.satisfaction)), 0);
  const healthScore = Math.min(100, Math.max(0, Math.round(avgSatisfaction * 20 - (lowSatisfaction.length * 10))));

  const painPoints = [];
  lowSatisfaction.forEach(tp => {
    if (tp.satisfaction === 1) {
      painPoints.push({
        touchpoint: tp.name,
        severity: 'critical',
        description: `${tp.name} has very low satisfaction (1/5) - immediate attention needed`
      });
    } else {
      painPoints.push({
        touchpoint: tp.name,
        severity: 'high',
        description: `${tp.name} has low satisfaction (${tp.satisfaction}/5)`
      });
    }
  });

  const longTouchpoints = touchpoints.filter(tp => tp.duration > 30).sort((a, b) => b.duration - a.duration).slice(0, 3);
  longTouchpoints.forEach(tp => {
    painPoints.push({
      touchpoint: tp.name,
      severity: 'medium',
      description: `${tp.name} takes ${tp.duration} minutes - consider optimization`
    });
  });

  const opportunities = [];
  if (avgSatisfaction < 3.5) {
    opportunities.push({ description: 'Overall satisfaction is below target - focus on pain points' });
  }
  touchpoints.forEach(tp => {
    if (tp.channel === 'office' && tp.duration > 20) {
      opportunities.push({ description: `Consider online alternative for "${tp.name}"` });
    }
    if (tp.channel === 'phone' && tp.satisfaction < 4) {
      opportunities.push({ description: `Add self-service option for "${tp.name}"` });
    }
  });

  const emotionalJourney = touchpoints.map(tp => ({
    touchpoint: tp.name,
    emotion: tp.satisfaction <= 2 ? 'frustrated' : tp.satisfaction >= 4 ? 'satisfied' : 'neutral',
    intensity: tp.satisfaction
  }));

  return {
    metrics: {
      healthScore,
      totalDuration,
      averageSatisfaction: avgSatisfaction,
      effortScore,
      touchpointCount: touchpoints.length
    },
    painPoints,
    opportunities,
    emotionalJourney,
    summary: {
      overallHealth: healthScore >= 70 ? 'Good' : healthScore >= 50 ? 'Fair' : 'Needs Improvement',
      criticalIssues: painPoints.filter(p => p.severity === 'critical').length,
      keyStrength: touchpoints.sort((a, b) => b.satisfaction - a.satisfaction)[0]?.name || 'N/A'
    }
  };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const path = event.path;
  const method = event.httpMethod;

  try {
    if (path === '/health' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'healthy', version: '2.0.0' })
      };
    }

    if (path === '/templates' && method === 'GET') {
      const list = Object.values(templates).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        estimatedDuration: t.estimatedDuration,
        touchpointCount: t.touchpointCount
      }));
      return { statusCode: 200, headers, body: JSON.stringify(list) };
    }

    if (path.startsWith('/templates/') && method === 'GET') {
      const id = path.split('/')[2];
      const template = templates[id];
      if (!template) {
        return { statusCode: 404, headers, body: JSON.stringify({ error: 'Template not found' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(template) };
    }

    if (path === '/analyze' && method === 'POST') {
      const journey = JSON.parse(event.body);
      const validation = validateJourney(journey);
      if (!validation.isValid) {
        return { statusCode: 400, headers, body: JSON.stringify({ errors: validation.errors }) };
      }
      const analysis = analyzeJourney(journey);
      return { statusCode: 200, headers, body: JSON.stringify(analysis) };
    }

    if (path === '/journey' && method === 'POST') {
      const journey = JSON.parse(event.body);
      const validation = validateJourney(journey);
      if (!validation.isValid) {
        return { statusCode: 400, headers, body: JSON.stringify({ errors: validation.errors }) };
      }
      return { 
        statusCode: 201, 
        headers, 
        body: JSON.stringify({ 
          id: Date.now(), 
          ...journey, 
          createdAt: new Date().toISOString() 
        }) 
      };
    }

    if (path === '/journeys' && method === 'GET') {
      return { statusCode: 200, headers, body: JSON.stringify([]) };
    }

    return { 
      statusCode: 404, 
      headers, 
      body: JSON.stringify({ error: 'Not found' }) 
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};
