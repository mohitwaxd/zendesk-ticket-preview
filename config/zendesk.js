/**
 * Zendesk Configuration
 * 
 * Loads Zendesk credentials from environment variables.
 * These should NEVER be exposed to the frontend.
 */

require('dotenv').config();

if (!process.env.ZENDESK_SUBDOMAIN) {
  throw new Error('ZENDESK_SUBDOMAIN environment variable is required');
}

if (!process.env.ZENDESK_EMAIL) {
  throw new Error('ZENDESK_EMAIL environment variable is required');
}

if (!process.env.ZENDESK_API_TOKEN) {
  throw new Error('ZENDESK_API_TOKEN environment variable is required');
}

if (!process.env.ZENDESK_JWT_SECRET) {
  throw new Error('ZENDESK_JWT_SECRET environment variable is required');
}

module.exports = {
  subdomain: process.env.ZENDESK_SUBDOMAIN,
  email: process.env.ZENDESK_EMAIL,
  apiToken: process.env.ZENDESK_API_TOKEN,
  jwtSecret: process.env.ZENDESK_JWT_SECRET,
  // Zendesk API base URL
  apiUrl: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2`,
  // Zendesk JWT SSO URL
  ssoUrl: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/access/jwt`
};
