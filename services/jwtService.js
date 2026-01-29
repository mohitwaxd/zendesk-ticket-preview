/**
 * Zendesk JWT SSO Service
 * 
 * Generates JWT tokens for Zendesk Single Sign-On (SSO).
 * 
 * Security:
 * - JWT is short-lived (5 minutes)
 * - Each JWT has unique jti (prevents reuse)
 * - Email comes from backend session (not frontend)
 * - Secret is never exposed
 */

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const zendeskConfig = require('../config/zendesk');

class JWTService {
  /**
   * Generate JWT token for Zendesk SSO
   * 
   * @param {string} email - User email (from backend session)
   * @param {string} name - User name (from backend session)
   * @returns {string} JWT token
   */
  generateToken(email, name) {
    const now = Math.floor(Date.now() / 1000);
    
    // JWT payload for Zendesk SSO (matching previous app format)
    // Required fields: iat, jti, email
    // Optional but recommended: name
    const cleanEmail = email.toLowerCase().trim().replace(/\s+/g, '+'); // Sanitize email like previous app
    const userName = name || cleanEmail.split('@')[0];
    
    // JWT payload format matching previous app exactly
    const payload = {
      email: cleanEmail, // User email (required) - must match Zendesk user
      name: userName, // User name (optional but recommended)
      iat: now, // Issued at time (required)
      jti: Math.floor(Math.random() * Math.pow(2, 64)).toString(), // Unique token ID (matching previous app format)
    };

    console.log('Generating JWT token for:', payload.email);
    console.log('JWT Secret configured:', zendeskConfig.jwtSecret ? 'Yes' : 'No');
    console.log('JWT Secret length:', zendeskConfig.jwtSecret ? zendeskConfig.jwtSecret.length : 0);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    // Validate JWT secret exists
    if (!zendeskConfig.jwtSecret) {
      throw new Error('ZENDESK_JWT_SECRET is not configured');
    }

    // Sign with Zendesk JWT secret using HS256 algorithm
    // Token expires in 5 minutes (300 seconds)
    let token;
    try {
      token = jwt.sign(payload, zendeskConfig.jwtSecret, {
        algorithm: 'HS256',
        expiresIn: '5m',
        noTimestamp: false // Ensure iat is included
      });
    } catch (error) {
      console.error('JWT signing error:', error);
      throw new Error(`Failed to sign JWT token: ${error.message}`);
    }

    console.log('JWT token generated successfully');
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 50) + '...');

    // Verify token can be decoded (sanity check)
    try {
      const decoded = jwt.decode(token);
      console.log('Token decoded successfully, payload:', JSON.stringify(decoded, null, 2));
    } catch (error) {
      console.warn('Warning: Could not decode generated token:', error);
    }

    return token;
  }

  /**
   * Validate return_to URL to ensure it's safe
   * Only allows paths starting with /hc/ (Help Center)
   * 
   * @param {string} returnTo - Return URL path
   * @returns {boolean} True if valid
   */
  validateReturnTo(returnTo) {
    if (!returnTo || typeof returnTo !== 'string') {
      return false;
    }
    
    // Must start with /hc/ to ensure it's a Help Center path
    // This prevents redirecting to admin or other sensitive areas
    return returnTo.startsWith('/hc/');
  }

  /**
   * Build Zendesk SSO redirect URL
   * 
   * @param {string} token - JWT token
   * @param {string} returnTo - Return path after SSO
   * @returns {string} Full Zendesk SSO URL
   */
  buildSSOUrl(token, returnTo) {
    const baseUrl = zendeskConfig.ssoUrl;
    const encodedReturnTo = encodeURIComponent(returnTo);
    
    // Build SSO URL: https://subdomain.zendesk.com/access/jwt?jwt=TOKEN&return_to=URL
    // Note: JWT token should be URL-encoded to handle special characters safely
    const encodedToken = encodeURIComponent(token);
    const ssoUrl = `${baseUrl}?jwt=${encodedToken}&return_to=${encodedReturnTo}`;
    
    // Log for debugging
    console.log('Building Zendesk SSO URL...');
    console.log('Base URL:', baseUrl);
    console.log('Return to:', returnTo);
    console.log('Encoded return to:', encodedReturnTo);
    console.log('Token length:', token.length);
    console.log('Encoded token length:', encodedToken.length);
    console.log('SSO URL (token hidden):', ssoUrl.replace(encodedToken, 'TOKEN_HIDDEN'));
    console.log('Full SSO URL length:', ssoUrl.length);
    
    // Validate URL format
    if (!ssoUrl.startsWith('https://') || !ssoUrl.includes('/access/jwt')) {
      throw new Error(`Invalid SSO URL format: ${ssoUrl}`);
    }
    
    // Validate URL is not too long (browsers have URL length limits)
    if (ssoUrl.length > 2000) {
      console.warn('Warning: SSO URL is very long (' + ssoUrl.length + ' chars), may cause issues');
    }
    
    return ssoUrl;
  }
}

module.exports = new JWTService();
