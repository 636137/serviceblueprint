/**
 * ServiceBlueprint API Server
 * Enterprise-grade journey mapping and experience analysis platform
 * 
 * @version 2.0.0
 * @author Government CX Team
 * @license MIT
 */

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// In-memory data store (replace with database in production)
const journeys = [];
let journeyId = 1;

/**
 * Journey Templates
 * Pre-built journey maps for common government services
 * Each template includes realistic touchpoints with channels, durations, and satisfaction scores
 */
const templates = {
  passport: {
    name: 'Passport Renewal',
    description: 'Complete journey for renewing a U.S. passport',
    category: 'Identity Documents',
    estimatedTime: 131,
    touchpoints: [
      { 
        name: 'Research requirements', 
        channel: 'web', 
        duration: 15, 
        satisfaction: 3,
        description: 'Visit travel.state.gov to understand renewal requirements'
      },
      { 
        name: 'Fill application form', 
        channel: 'web', 
        duration: 30, 
        satisfaction: 2,
        description: 'Complete DS-82 form online with personal information'
      },
      { 
        name: 'Schedule appointment', 
        channel: 'phone', 
        duration: 20, 
        satisfaction: 2,
        description: 'Call to schedule passport photo and submission appointment'
      },
      { 
        name: 'Visit office', 
        channel: 'office', 
        duration: 45, 
        satisfaction: 3,
        description: 'Travel to passport acceptance facility'
      },
      { 
        name: 'Submit documents', 
        channel: 'office', 
        duration: 15, 
        satisfaction: 4,
        description: 'Submit application, photo, and payment'
      },
      { 
        name: 'Track status', 
        channel: 'web', 
        duration: 5, 
        satisfaction: 4,
        description: 'Monitor application status online'
      },
      { 
        name: 'Receive passport', 
        channel: 'mail', 
        duration: 1, 
        satisfaction: 5,
        description: 'Passport delivered via USPS'
      }
    ]
  },
  benefits: {
    name: 'Apply for Benefits',
    description: 'Journey for applying for government assistance programs',
    category: 'Social Services',
    estimatedTime: 1561,
    touchpoints: [
      { 
        name: 'Check eligibility', 
        channel: 'web', 
        duration: 10, 
        satisfaction: 4,
        description: 'Use online eligibility screener'
      },
      { 
        name: 'Gather documents', 
        channel: 'offline', 
        duration: 60, 
        satisfaction: 2,
        description: 'Collect proof of income, identity, and residency'
      },
      { 
        name: 'Complete application', 
        channel: 'web', 
        duration: 45, 
        satisfaction: 2,
        description: 'Fill out detailed application form'
      },
      { 
        name: 'Submit application', 
        channel: 'web', 
        duration: 5, 
        satisfaction: 4,
        description: 'Upload documents and submit electronically'
      },
      { 
        name: 'Wait for review', 
        channel: 'offline', 
        duration: 1440, 
        satisfaction: 2,
        description: 'Application under review (typically 1-2 weeks)'
      },
      { 
        name: 'Receive decision', 
        channel: 'mail', 
        duration: 1, 
        satisfaction: 5,
        description: 'Approval or denial letter received'
      }
    ]
  },
  tax: {
    name: 'File Tax Return',
    description: 'Individual income tax filing journey',
    category: 'Tax Services',
    estimatedTime: 125,
    touchpoints: [
      { 
        name: 'Gather tax documents', 
        channel: 'offline', 
        duration: 30, 
        satisfaction: 3,
        description: 'Collect W-2s, 1099s, and receipts'
      },
      { 
        name: 'Choose filing method', 
        channel: 'web', 
        duration: 10, 
        satisfaction: 4,
        description: 'Select online tax software or paper filing'
      },
      { 
        name: 'Enter information', 
        channel: 'web', 
        duration: 60, 
        satisfaction: 2,
        description: 'Input income, deductions, and credits'
      },
      { 
        name: 'Review return', 
        channel: 'web', 
        duration: 15, 
        satisfaction: 3,
        description: 'Verify accuracy of tax calculations'
      },
      { 
        name: 'Submit return', 
        channel: 'web', 
        duration: 5, 
        satisfaction: 4,
        description: 'E-file return to IRS'
      },
      { 
        name: 'Track refund', 
        channel: 'web', 
        duration: 5, 
        satisfaction: 5,
        description: 'Check refund status on IRS website'
      }
    ]
  },
  license: {
    name: 'Renew Driver License',
    description: 'DMV driver license renewal process',
    category: 'Motor Vehicles',
    estimatedTime: 95,
    touchpoints: [
      { 
        name: 'Receive renewal notice', 
        channel: 'mail', 
        duration: 1, 
        satisfaction: 4,
        description: 'DMV sends renewal reminder'
      },
      { 
        name: 'Check renewal options', 
        channel: 'web', 
        duration: 10, 
        satisfaction: 4,
        description: 'Review online vs in-person renewal'
      },
      { 
        name: 'Schedule appointment', 
        channel: 'web', 
        duration: 15, 
        satisfaction: 3,
        description: 'Book DMV appointment online'
      },
      { 
        name: 'Visit DMV', 
        channel: 'office', 
        duration: 45, 
        satisfaction: 2,
        description: 'Wait and process renewal at DMV office'
      },
      { 
        name: 'Take vision test', 
        channel: 'office', 
        duration: 5, 
        satisfaction: 4,
        description: 'Complete required vision screening'
      },
      { 
        name: 'Pay fee', 
        channel: 'office', 
        duration: 5, 
        satisfaction: 4,
        description: 'Pay renewal fee'
      },
      { 
        name: 'Receive temporary license', 
        channel: 'office', 
        duration: 5, 
        satisfaction: 4,
        description: 'Get paper temporary license'
      },
      { 
        name: 'Receive permanent license', 
        channel: 'mail', 
        duration: 10, 
        satisfaction: 5,
        description: 'New license arrives by mail'
      }
    ]
  }
};

/**
 * Validation Functions
 */

/**
 * Validates touchpoint data structure
 * @param {Object} touchpoint - Touchpoint object to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateTouchpoint(touchpoint) {
  const errors = [];
  
  if (!touchpoint.name || typeof touchpoint.name !== 'string') {
    errors.push('Touchpoint name is required and must be a string');
  }
  
  if (!touchpoint.channel || !['web', 'mobile', 'phone', 'office', 'mail', 'offline'].includes(touchpoint.channel)) {
    errors.push('Valid channel is required (web, mobile, phone, office, mail, offline)');
  }
  
  if (typeof touchpoint.duration !== 'number' || touchpoint.duration < 0) {
    errors.push('Duration must be a positive number');
  }
  
  if (typeof touchpoint.satisfaction !== 'number' || touchpoint.satisfaction < 1 || touchpoint.satisfaction > 5) {
    errors.push('Satisfaction must be a number between 1 and 5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates journey data structure
 * @param {Object} journey - Journey object to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateJourney(journey) {
  const errors = [];
  
  if (!journey.serviceName || typeof journey.serviceName !== 'string') {
    errors.push('Service name is required and must be a string');
  }
  
  if (!Array.isArray(journey.touchpoints) || journey.touchpoints.length === 0) {
    errors.push('At least one touchpoint is required');
  } else {
    journey.touchpoints.forEach((tp, index) => {
      const validation = validateTouchpoint(tp);
      if (!validation.isValid) {
        errors.push(`Touchpoint ${index + 1}: ${validation.errors.join(', ')}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * API Endpoints
 */

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * GET /api/templates
 * Get list of all available journey templates
 * @returns {Array} List of template metadata
 */
app.get('/api/templates', (req, res) => {
  try {
    const templateList = Object.keys(templates).map(key => ({
      id: key,
      name: templates[key].name,
      description: templates[key].description,
      category: templates[key].category,
      touchpointCount: templates[key].touchpoints.length,
      estimatedTime: templates[key].estimatedTime
    }));
    
    res.json(templateList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates', details: error.message });
  }
});

/**
 * GET /api/templates/:id
 * Load a specific journey template
 * @param {string} id - Template identifier
 * @returns {Object} Complete template with all touchpoints
 */
app.get('/api/templates/:id', (req, res) => {
  try {
    const template = templates[req.params.id];
    
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        availableTemplates: Object.keys(templates)
      });
    }
    
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load template', details: error.message });
  }
});

/**
 * POST /api/journey
 * Create and save a new journey map
 * @body {Object} journey - Journey data with serviceName and touchpoints
 * @returns {Object} Saved journey with generated ID
 */
app.post('/api/journey', (req, res) => {
  try {
    const validation = validateJourney(req.body);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Invalid journey data',
        validationErrors: validation.errors
      });
    }
    
    const journey = {
      id: journeyId++,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    journeys.push(journey);
    
    res.status(201).json(journey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journey', details: error.message });
  }
});

/**
 * GET /api/journeys
 * Get all saved journeys
 * @query {number} limit - Maximum number of journeys to return
 * @query {number} offset - Number of journeys to skip
 * @returns {Array} List of saved journeys
 */
app.get('/api/journeys', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const paginatedJourneys = journeys.slice(offset, offset + limit);
    
    res.json({
      journeys: paginatedJourneys,
      total: journeys.length,
      limit,
      offset
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journeys', details: error.message });
  }
});

/**
 * GET /api/journeys/:id
 * Get a specific journey by ID
 * @param {number} id - Journey identifier
 * @returns {Object} Journey data
 */
app.get('/api/journeys/:id', (req, res) => {
  try {
    const journey = journeys.find(j => j.id === parseInt(req.params.id));
    
    if (!journey) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    
    res.json(journey);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journey', details: error.message });
  }
});

/**
 * DELETE /api/journeys/:id
 * Delete a journey by ID
 * @param {number} id - Journey identifier
 * @returns {Object} Success message
 */
app.delete('/api/journeys/:id', (req, res) => {
  try {
    const index = journeys.findIndex(j => j.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: 'Journey not found' });
    }
    
    journeys.splice(index, 1);
    
    res.json({ message: 'Journey deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journey', details: error.message });
  }
});

/**
 * POST /api/analyze
 * Analyze a journey and generate comprehensive insights
 * @body {Object} data - Journey data with serviceName and touchpoints
 * @returns {Object} Analysis results with metrics, pain points, and opportunities
 */
app.post('/api/analyze', (req, res) => {
  try {
    const { serviceName, touchpoints } = req.body;
    
    // Validate input
    if (!touchpoints || !Array.isArray(touchpoints) || touchpoints.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input',
        message: 'Touchpoints array is required and must not be empty'
      });
    }
    
    const painPoints = [];
    const opportunities = [];
    const emotions = [];
    const recommendations = [];
    
    // Analyze each touchpoint
    touchpoints.forEach((tp, index) => {
      const step = index + 1;
      
      // Critical satisfaction issues
      if (tp.satisfaction <= 2) {
        painPoints.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          issue: 'Critical dissatisfaction',
          severity: 'critical',
          recommendation: 'Immediate redesign required - conduct user research to identify root causes',
          impact: 'high',
          priority: 1
        });
        
        recommendations.push({
          step,
          type: 'critical',
          action: `Redesign "${tp.name}" touchpoint`,
          rationale: `Satisfaction score of ${tp.satisfaction}/5 indicates severe user frustration`,
          estimatedImpact: 'High - could improve overall journey satisfaction by 15-20%'
        });
      } else if (tp.satisfaction === 3) {
        painPoints.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          issue: 'Neutral experience - room for improvement',
          severity: 'medium',
          recommendation: 'Enhance user experience through usability testing and iterative improvements',
          impact: 'medium',
          priority: 3
        });
      }
      
      // Duration-based issues
      if (tp.duration > 60) {
        painPoints.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          issue: `Excessive wait time (${tp.duration} minutes)`,
          severity: 'high',
          recommendation: 'Streamline process through automation or additional resources',
          impact: 'high',
          priority: 2
        });
        
        recommendations.push({
          step,
          type: 'efficiency',
          action: `Reduce duration of "${tp.name}"`,
          rationale: `${tp.duration} minutes exceeds acceptable threshold`,
          estimatedImpact: 'Medium - could reduce total journey time by 20-30%'
        });
      } else if (tp.duration > 30) {
        painPoints.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          issue: `Long wait time (${tp.duration} minutes)`,
          severity: 'medium',
          recommendation: 'Consider process optimization or self-service options',
          impact: 'medium',
          priority: 3
        });
      }
      
      // Identify opportunities
      if (tp.satisfaction >= 4) {
        opportunities.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          recommendation: 'Replicate best practices from this touchpoint across other steps',
          type: 'best-practice',
          potentialImpact: 'medium'
        });
      }
      
      if (tp.duration < 10 && tp.satisfaction >= 4) {
        opportunities.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          recommendation: 'Excellent efficiency - use as benchmark for other touchpoints',
          type: 'benchmark',
          potentialImpact: 'high'
        });
      }
      
      // Channel-specific opportunities
      if (tp.channel === 'offline' && tp.duration > 30) {
        opportunities.push({
          step,
          touchpoint: tp.name,
          channel: tp.channel,
          recommendation: 'Consider digitizing this offline process to improve efficiency',
          type: 'digitization',
          potentialImpact: 'high'
        });
      }
      
      // Emotional journey mapping
      let emotion = 'neutral';
      if (tp.satisfaction >= 4) emotion = 'positive';
      if (tp.satisfaction <= 2) emotion = 'negative';
      emotions.push({ 
        step, 
        emotion, 
        score: tp.satisfaction,
        touchpoint: tp.name
      });
    });
    
    // Calculate comprehensive metrics
    const avgSatisfaction = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
    const totalDuration = touchpoints.reduce((sum, tp) => sum + tp.duration, 0);
    
    // Channel breakdown
    const channelBreakdown = {};
    touchpoints.forEach(tp => {
      channelBreakdown[tp.channel] = (channelBreakdown[tp.channel] || 0) + 1;
    });
    
    // Effort score (weighted by dissatisfaction)
    const effortScore = touchpoints.reduce((sum, tp) => {
      return sum + (tp.duration * (6 - tp.satisfaction));
    }, 0) / touchpoints.length;
    
    // Journey health score (0-100)
    const healthScore = Math.round((avgSatisfaction / 5) * 100);
    
    // Completion rate estimate (based on satisfaction)
    const completionRate = Math.round(avgSatisfaction * 18 + 10); // Simplified model
    
    // Calculate satisfaction trend
    const satisfactionTrend = touchpoints.map(tp => tp.satisfaction);
    const trendDirection = satisfactionTrend[satisfactionTrend.length - 1] > satisfactionTrend[0] ? 'improving' : 
                          satisfactionTrend[satisfactionTrend.length - 1] < satisfactionTrend[0] ? 'declining' : 'stable';
    
    // Identify bottlenecks (longest duration touchpoints)
    const bottlenecks = touchpoints
      .map((tp, index) => ({ ...tp, step: index + 1 }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 3)
      .map(tp => ({
        step: tp.step,
        touchpoint: tp.name,
        duration: tp.duration,
        percentOfTotal: Math.round((tp.duration / totalDuration) * 100)
      }));
    
    // Generate executive summary
    const summary = {
      overallHealth: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : healthScore >= 40 ? 'Fair' : 'Poor',
      criticalIssues: painPoints.filter(p => p.severity === 'critical').length,
      highPriorityActions: recommendations.filter(r => r.type === 'critical').length,
      keyStrength: opportunities.length > 0 ? opportunities[0].touchpoint : 'None identified',
      primaryConcern: painPoints.length > 0 ? painPoints[0].touchpoint : 'None identified'
    };
    
    res.json({
      serviceName,
      summary,
      painPoints: painPoints.sort((a, b) => a.priority - b.priority),
      opportunities,
      emotions,
      recommendations: recommendations.slice(0, 5), // Top 5 recommendations
      metrics: {
        averageSatisfaction: avgSatisfaction.toFixed(2),
        totalDuration,
        touchpointCount: touchpoints.length,
        channelBreakdown,
        effortScore: effortScore.toFixed(1),
        healthScore,
        completionRate,
        satisfactionTrend: trendDirection,
        bottlenecks
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze journey',
      details: error.message
    });
  }
});

/**
 * POST /api/compare
 * Compare two journeys side-by-side
 * @body {Object} data - Two journey objects to compare
 * @returns {Object} Comparative analysis
 */
app.post('/api/compare', (req, res) => {
  try {
    const { journey1, journey2 } = req.body;
    
    if (!journey1 || !journey2) {
      return res.status(400).json({ error: 'Two journeys required for comparison' });
    }
    
    const calc = (tps) => ({
      avgSat: tps.reduce((s, t) => s + t.satisfaction, 0) / tps.length,
      totalDur: tps.reduce((s, t) => s + t.duration, 0),
      count: tps.length,
      healthScore: Math.round((tps.reduce((s, t) => s + t.satisfaction, 0) / tps.length / 5) * 100)
    });
    
    const j1 = calc(journey1.touchpoints);
    const j2 = calc(journey2.touchpoints);
    
    res.json({
      journey1: { name: journey1.name, ...j1 },
      journey2: { name: journey2.name, ...j2 },
      comparison: {
        satisfactionDiff: (j1.avgSat - j2.avgSat).toFixed(2),
        durationDiff: j1.totalDur - j2.totalDur,
        healthScoreDiff: j1.healthScore - j2.healthScore,
        winner: j1.avgSat > j2.avgSat ? journey1.name : journey2.name,
        recommendation: j1.avgSat > j2.avgSat ? 
          `${journey1.name} provides better user experience` :
          `${journey2.name} provides better user experience`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare journeys', details: error.message });
  }
});

/**
 * GET /api/stats
 * Get platform statistics
 * @returns {Object} Overall platform statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const totalJourneys = journeys.length;
    const totalTouchpoints = journeys.reduce((sum, j) => sum + j.touchpoints.length, 0);
    const avgTouchpointsPerJourney = totalJourneys > 0 ? (totalTouchpoints / totalJourneys).toFixed(1) : 0;
    
    res.json({
      totalJourneys,
      totalTouchpoints,
      avgTouchpointsPerJourney,
      availableTemplates: Object.keys(templates).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics', details: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/templates',
      'GET /api/templates/:id',
      'POST /api/journey',
      'GET /api/journeys',
      'GET /api/journeys/:id',
      'DELETE /api/journeys/:id',
      'POST /api/analyze',
      'POST /api/compare',
      'GET /api/stats'
    ]
  });
});

const PORT = process.env.PORT || 3009;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ServiceBlueprint API Server v2.0.0                     ║
║   Enterprise Journey Mapping Platform                     ║
║                                                           ║
║   Server running on port ${PORT}                              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Started: ${new Date().toISOString()}              ║
║                                                           ║
║   API Documentation: /api/health                          ║
║   Templates: ${Object.keys(templates).length} available                                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});
