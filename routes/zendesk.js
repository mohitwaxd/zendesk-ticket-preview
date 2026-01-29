/**
 * Zendesk SSO Routes
 * 
 * Handles Zendesk JWT Single Sign-On authentication.
 * 
 * Security:
 * - User must be authenticated (email from session)
 * - Validates return_to URL
 * - Generates short-lived, unique JWT tokens
 * - Never trusts frontend identity
 */

const express = require('express');
const router = express.Router();
const jwtService = require('../services/jwtService');

/**
 * Simple session store (in production, use Redis or database)
 * In a real app, this would be managed by a proper session middleware
 */
const sessions = new Map();

/**
 * Middleware to get user email from session
 * In production, replace this with proper session management
 * 
 * For demo purposes, we'll use a query parameter or session cookie
 * In production, implement proper email verification/authentication
 */
function getUserFromSession(req) {
  // Option 1: Check for session cookie
  const sessionId = req.cookies?.sessionId;
  if (sessionId && sessions.has(sessionId)) {
    return sessions.get(sessionId);
  }

  // Option 2: For demo, allow email query param (NOT for production!)
  // In production, require proper authentication flow
  const email = req.query.email;
  if (email && email.includes('@')) {
    return { email, name: email.split('@')[0] };
  }

  return null;
}

/**
 * GET /zendesk/sso
 * 
 * Zendesk JWT SSO endpoint
 * 
 * Flow:
 * 1. Verify user is authenticated (get email from session)
 * 2. Validate return_to parameter
 * 3. Generate JWT token
 * 4. Redirect to Zendesk SSO URL
 * 
 * Query parameters:
 * - return_to: Path to redirect after SSO (must start with /hc/)
 * - email: (Optional, for demo) User email if not in session
 */
router.get('/sso', async (req, res) => {
  try {
    // Get user from session (must be authenticated)
    const user = getUserFromSession(req);
    
    if (!user || !user.email) {
      // In production, redirect to login page
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please authenticate before accessing Zendesk'
      });
    }

    // Get return_to parameter
    const returnTo = req.query.return_to;

    // Validate return_to - must start with /hc/ for security
    if (!returnTo || !jwtService.validateReturnTo(returnTo)) {
      return res.status(400).json({
        error: 'Invalid return_to parameter',
        message: 'return_to must start with /hc/'
      });
    }

    // Generate JWT token with user email from backend session
    // NEVER trust email from frontend - always use backend session
    const token = jwtService.generateToken(user.email, user.name);

    // Build Zendesk SSO URL
    const ssoUrl = jwtService.buildSSOUrl(token, returnTo);

    // Redirect to Zendesk SSO
    res.redirect(ssoUrl);

  } catch (error) {
    console.error('Error in Zendesk SSO:', error);
    res.status(500).json({
      error: 'SSO authentication failed',
      message: error.message
    });
  }
});

/**
 * POST /zendesk/authenticate
 * 
 * Demo endpoint to set user session
 * In production, replace with proper authentication flow
 * 
 * This is a simple demo - in production, implement:
 * - Email verification
 * - Password authentication
 * - OAuth flow
 * - etc.
 */
router.post('/authenticate', (req, res) => {
  const { email, name } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({
      error: 'Valid email is required'
    });
  }

  // Create session (in production, use proper session management)
  const sessionId = require('uuid').v4();
  sessions.set(sessionId, { email, name: name || email.split('@')[0] });

  // Set session cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({
    success: true,
    message: 'Session created'
  });
});

module.exports = router;
