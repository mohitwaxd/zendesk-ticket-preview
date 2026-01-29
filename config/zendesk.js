/**
 * Zendesk Configuration
 * 
 * Loads Zendesk credentials from environment variables.
 * These should NEVER be exposed to the frontend.
 */

require('dotenv').config();

// Validate and sanitize subdomain
let subdomain = process.env.ZENDESK_SUBDOMAIN;

if (!subdomain) {
  throw new Error('ZENDESK_SUBDOMAIN environment variable is required');
}

// Remove any protocol or domain parts if accidentally included
subdomain = subdomain.trim();
subdomain = subdomain.replace(/^https?:\/\//, ''); // Remove http:// or https://
subdomain = subdomain.replace(/\.zendesk\.com.*$/, ''); // Remove .zendesk.com and anything after
subdomain = subdomain.split('/')[0]; // Remove any path

if (!subdomain || subdomain.length === 0) {
  throw new Error('ZENDESK_SUBDOMAIN must be a valid subdomain (e.g., "mycompany" not "https://mycompany.zendesk.com")');
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
  subdomain: subdomain,
  email: process.env.ZENDESK_EMAIL,
  apiToken: process.env.ZENDESK_API_TOKEN,
  jwtSecret: process.env.ZENDESK_JWT_SECRET,
  // Zendesk API base URL
  apiUrl: `https://${subdomain}.zendesk.com/api/v2`,
  // Zendesk JWT SSO URL
  ssoUrl: `https://${subdomain}.zendesk.com/access/jwt`
};
