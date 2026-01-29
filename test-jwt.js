/**
 * Test JWT SSO Token Generation
 * 
 * Run this locally to test JWT token generation
 * node test-jwt.js
 */

require('dotenv').config();
const jwtService = require('./services/jwtService');
const zendeskConfig = require('./config/zendesk');

console.log('=== JWT SSO Test ===\n');

// Test configuration
console.log('1. Configuration Check:');
console.log('   Subdomain:', zendeskConfig.subdomain);
console.log('   SSO URL:', zendeskConfig.ssoUrl);
console.log('   JWT Secret configured:', zendeskConfig.jwtSecret ? 'Yes' : 'No');
console.log('   JWT Secret length:', zendeskConfig.jwtSecret ? zendeskConfig.jwtSecret.length : 0);
console.log('');

// Test token generation
console.log('2. Token Generation Test:');
try {
  const testEmail = 'support@telecrm.in';
  const testName = 'Support';
  const token = jwtService.generateToken(testEmail, testName);
  
  console.log('   Email:', testEmail);
  console.log('   Name:', testName);
  console.log('   Token generated: Yes');
  console.log('   Token length:', token.length);
  console.log('   Token preview:', token.substring(0, 50) + '...');
  console.log('');
  
  // Test SSO URL building
  console.log('3. SSO URL Test:');
  const returnTo = '/hc/en-us/requests/2405';
  const ssoUrl = jwtService.buildSSOUrl(token, returnTo);
  
  console.log('   Return to:', returnTo);
  console.log('   SSO URL:', ssoUrl.replace(token, 'TOKEN_HIDDEN'));
  console.log('   Full SSO URL:', ssoUrl);
  console.log('');
  
  // Decode token to verify payload
  console.log('4. Token Payload Verification:');
  const jwt = require('jsonwebtoken');
  const decoded = jwt.decode(token);
  console.log('   Decoded payload:', JSON.stringify(decoded, null, 2));
  console.log('');
  
  console.log('✅ All tests passed!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Verify support@telecrm.in exists in Zendesk');
  console.log('2. Verify JWT SSO is enabled in Zendesk');
  console.log('3. Verify JWT secret matches exactly');
  console.log('4. Test the SSO URL in browser:', ssoUrl);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
