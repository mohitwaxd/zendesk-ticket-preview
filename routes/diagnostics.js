/**
 * Diagnostics Route
 * 
 * Helps debug JWT SSO issues
 */

const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwtService');
const zendeskConfig = require('../config/zendesk');

router.get('/jwt-test', (req, res) => {
  try {
    // Generate a test token
    const testEmail = 'support@telecrm.in';
    const testToken = jwtService.generateToken(testEmail, 'Support');
    const testReturnTo = '/hc/en-us/requests/2405';
    const testSsoUrl = jwtService.buildSSOUrl(testToken, testReturnTo);

    res.json({
      status: 'success',
      config: {
        subdomain: zendeskConfig.subdomain,
        ssoUrl: zendeskConfig.ssoUrl,
        jwtSecretConfigured: zendeskConfig.jwtSecret ? 'Yes' : 'No',
        jwtSecretLength: zendeskConfig.jwtSecret ? zendeskConfig.jwtSecret.length : 0
      },
      test: {
        email: testEmail,
        tokenLength: testToken.length,
        tokenPreview: testToken.substring(0, 50) + '...',
        returnTo: testReturnTo,
        ssoUrl: testSsoUrl.replace(testToken, 'TOKEN_HIDDEN'),
        fullSsoUrl: testSsoUrl
      },
      instructions: {
        step1: 'Check if support@telecrm.in exists in Zendesk: Admin → People → Users',
        step2: 'Verify JWT SSO is enabled: Admin → Security → SSO → JWT SSO',
        step3: 'Verify Shared Secret matches ZENDESK_JWT_SECRET in Vercel',
        step4: 'Test the SSO URL manually by visiting the fullSsoUrl above'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
