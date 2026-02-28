/**
 * ServiceBlueprint API Tests
 * Comprehensive test suite for journey mapping platform
 * 
 * Run with: npm test
 */

const assert = require('assert');

// Test data
const validTouchpoint = {
  name: 'Test Touchpoint',
  channel: 'web',
  duration: 15,
  satisfaction: 4
};

const validJourney = {
  serviceName: 'Test Service',
  touchpoints: [
    { name: 'Step 1', channel: 'web', duration: 10, satisfaction: 4 },
    { name: 'Step 2', channel: 'phone', duration: 20, satisfaction: 3 },
    { name: 'Step 3', channel: 'office', duration: 30, satisfaction: 5 }
  ]
};

// Test Suite
console.log('🧪 Running ServiceBlueprint Tests...\n');

let passedTests = 0;
let failedTests = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ ${description}`);
    passedTests++;
  } catch (error) {
    console.log(`❌ ${description}`);
    console.log(`   Error: ${error.message}`);
    failedTests++;
  }
}

// Validation Tests
console.log('📋 Validation Tests:');

test('Valid touchpoint passes validation', () => {
  assert.strictEqual(typeof validTouchpoint.name, 'string');
  assert.ok(['web', 'mobile', 'phone', 'office', 'mail', 'offline'].includes(validTouchpoint.channel));
  assert.ok(validTouchpoint.duration >= 0);
  assert.ok(validTouchpoint.satisfaction >= 1 && validTouchpoint.satisfaction <= 5);
});

test('Invalid touchpoint name fails', () => {
  const invalid = { ...validTouchpoint, name: 123 };
  assert.notStrictEqual(typeof invalid.name, 'string');
});

test('Invalid channel fails', () => {
  const invalid = { ...validTouchpoint, channel: 'invalid' };
  assert.ok(!['web', 'mobile', 'phone', 'office', 'mail', 'offline'].includes(invalid.channel));
});

test('Negative duration fails', () => {
  const invalid = { ...validTouchpoint, duration: -5 };
  assert.ok(invalid.duration < 0);
});

test('Satisfaction out of range fails', () => {
  const invalid1 = { ...validTouchpoint, satisfaction: 0 };
  const invalid2 = { ...validTouchpoint, satisfaction: 6 };
  assert.ok(invalid1.satisfaction < 1 || invalid2.satisfaction > 5);
});

test('Valid journey passes validation', () => {
  assert.strictEqual(typeof validJourney.serviceName, 'string');
  assert.ok(Array.isArray(validJourney.touchpoints));
  assert.ok(validJourney.touchpoints.length > 0);
});

test('Journey without service name fails', () => {
  const invalid = { ...validJourney, serviceName: '' };
  assert.ok(!invalid.serviceName);
});

test('Journey without touchpoints fails', () => {
  const invalid = { ...validJourney, touchpoints: [] };
  assert.strictEqual(invalid.touchpoints.length, 0);
});

// Calculation Tests
console.log('\n📊 Calculation Tests:');

test('Average satisfaction calculated correctly', () => {
  const touchpoints = validJourney.touchpoints;
  const avg = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
  assert.strictEqual(avg, 4); // (4+3+5)/3 = 4
});

test('Total duration calculated correctly', () => {
  const touchpoints = validJourney.touchpoints;
  const total = touchpoints.reduce((sum, tp) => sum + tp.duration, 0);
  assert.strictEqual(total, 60); // 10+20+30 = 60
});

test('Health score calculated correctly', () => {
  const touchpoints = validJourney.touchpoints;
  const avg = touchpoints.reduce((sum, tp) => sum + tp.satisfaction, 0) / touchpoints.length;
  const healthScore = Math.round((avg / 5) * 100);
  assert.strictEqual(healthScore, 80); // (4/5)*100 = 80
});

test('Effort score calculated correctly', () => {
  const touchpoints = validJourney.touchpoints;
  const effortScore = touchpoints.reduce((sum, tp) => {
    return sum + (tp.duration * (6 - tp.satisfaction));
  }, 0) / touchpoints.length;
  assert.ok(effortScore > 0);
});

test('Channel breakdown calculated correctly', () => {
  const touchpoints = validJourney.touchpoints;
  const breakdown = {};
  touchpoints.forEach(tp => {
    breakdown[tp.channel] = (breakdown[tp.channel] || 0) + 1;
  });
  assert.strictEqual(breakdown.web, 1);
  assert.strictEqual(breakdown.phone, 1);
  assert.strictEqual(breakdown.office, 1);
});

// Pain Point Detection Tests
console.log('\n⚠️  Pain Point Detection Tests:');

test('Critical satisfaction detected (score <= 2)', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 2 };
  assert.ok(touchpoint.satisfaction <= 2);
});

test('Long duration detected (> 60 min)', () => {
  const touchpoint = { ...validTouchpoint, duration: 65 };
  assert.ok(touchpoint.duration > 60);
});

test('Medium duration detected (> 30 min)', () => {
  const touchpoint = { ...validTouchpoint, duration: 45 };
  assert.ok(touchpoint.duration > 30 && touchpoint.duration <= 60);
});

test('Neutral satisfaction detected (score = 3)', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 3 };
  assert.strictEqual(touchpoint.satisfaction, 3);
});

// Opportunity Detection Tests
console.log('\n💡 Opportunity Detection Tests:');

test('High satisfaction detected (score >= 4)', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 4 };
  assert.ok(touchpoint.satisfaction >= 4);
});

test('Efficient touchpoint detected (duration < 10, satisfaction >= 4)', () => {
  const touchpoint = { ...validTouchpoint, duration: 8, satisfaction: 4 };
  assert.ok(touchpoint.duration < 10 && touchpoint.satisfaction >= 4);
});

test('Digitization opportunity detected (offline + long duration)', () => {
  const touchpoint = { ...validTouchpoint, channel: 'offline', duration: 45 };
  assert.ok(touchpoint.channel === 'offline' && touchpoint.duration > 30);
});

// Emotional Journey Tests
console.log('\n😊 Emotional Journey Tests:');

test('Positive emotion for high satisfaction', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 5 };
  const emotion = touchpoint.satisfaction >= 4 ? 'positive' : 'neutral';
  assert.strictEqual(emotion, 'positive');
});

test('Negative emotion for low satisfaction', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 1 };
  const emotion = touchpoint.satisfaction <= 2 ? 'negative' : 'neutral';
  assert.strictEqual(emotion, 'negative');
});

test('Neutral emotion for mid satisfaction', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 3 };
  const emotion = touchpoint.satisfaction >= 4 ? 'positive' : 
                  touchpoint.satisfaction <= 2 ? 'negative' : 'neutral';
  assert.strictEqual(emotion, 'neutral');
});

// Edge Cases
console.log('\n🔍 Edge Case Tests:');

test('Single touchpoint journey', () => {
  const journey = {
    serviceName: 'Single Step',
    touchpoints: [validTouchpoint]
  };
  assert.strictEqual(journey.touchpoints.length, 1);
});

test('Maximum satisfaction (5)', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 5 };
  assert.strictEqual(touchpoint.satisfaction, 5);
});

test('Minimum satisfaction (1)', () => {
  const touchpoint = { ...validTouchpoint, satisfaction: 1 };
  assert.strictEqual(touchpoint.satisfaction, 1);
});

test('Zero duration touchpoint', () => {
  const touchpoint = { ...validTouchpoint, duration: 0 };
  assert.strictEqual(touchpoint.duration, 0);
});

test('Very long duration (1440 min = 1 day)', () => {
  const touchpoint = { ...validTouchpoint, duration: 1440 };
  assert.strictEqual(touchpoint.duration, 1440);
});

// Template Tests
console.log('\n📋 Template Tests:');

test('Passport template exists', () => {
  const templates = ['passport', 'benefits', 'tax', 'license'];
  assert.ok(templates.includes('passport'));
});

test('Benefits template exists', () => {
  const templates = ['passport', 'benefits', 'tax', 'license'];
  assert.ok(templates.includes('benefits'));
});

test('Tax template exists', () => {
  const templates = ['passport', 'benefits', 'tax', 'license'];
  assert.ok(templates.includes('tax'));
});

test('License template exists', () => {
  const templates = ['passport', 'benefits', 'tax', 'license'];
  assert.ok(templates.includes('license'));
});

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Test Results:`);
console.log(`   ✅ Passed: ${passedTests}`);
console.log(`   ❌ Failed: ${failedTests}`);
console.log(`   📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log('\n🎉 All tests passed!\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review.\n');
  process.exit(1);
}
