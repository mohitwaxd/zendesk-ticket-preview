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
    
    // JWT payload for Zendesk SSO
    const payload = {
      iat: now, // Issued at time
      jti: uuidv4(), // Unique token ID (prevents reuse)
      email: email,
      name: name || email.split('@')[0], // Use email prefix if name not provided
    };

    // Sign with Zendesk JWT secret
    // Token expires in 5 minutes (300 seconds)
    const token = jwt.sign(payload, zendeskConfig.jwtSecret, {
      algorithm: 'HS256',
      expiresIn: '5m'
    });

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
    return `${baseUrl}?jwt=${token}&return_to=${encodedReturnTo}`;
  }
}

module.exports = new JWTService();
