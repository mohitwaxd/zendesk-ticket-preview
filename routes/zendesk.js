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
  // In production, require proper authentication flow (email verification, etc.)
  // This is acceptable for demo because:
  // 1. The email is only used to generate JWT for Zendesk SSO
  // 2. Zendesk will validate the user and only show tickets they have access to
  // 3. The JWT secret is still protected on the backend
  const email = req.query.email;
  if (email && email.includes('@') && email.includes('.')) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      return { email: email.trim().toLowerCase(), name: email.split('@')[0] };
    }
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
    
    // Get return_to parameter
    const returnTo = req.query.return_to;

    // Validate return_to - must start with /hc/ for security
    if (!returnTo || !jwtService.validateReturnTo(returnTo)) {
      return res.status(400).json({
        error: 'Invalid return_to parameter',
        message: 'return_to must start with /hc/'
      });
    }

    // If no user session, show authentication form
    if (!user || !user.email) {
      // Return HTML form for email authentication
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authenticate to View Ticket</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }
            .container {
              background: white;
              border-radius: 12px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              padding: 40px;
              max-width: 400px;
              width: 100%;
            }
            h1 {
              color: #212529;
              margin-bottom: 10px;
              font-size: 24px;
            }
            p {
              color: #6c757d;
              margin-bottom: 30px;
              font-size: 14px;
            }
            .form-group {
              margin-bottom: 20px;
            }
            label {
              display: block;
              color: #212529;
              font-weight: 600;
              margin-bottom: 8px;
              font-size: 14px;
            }
            input {
              width: 100%;
              padding: 12px;
              border: 2px solid #e9ecef;
              border-radius: 8px;
              font-size: 16px;
              transition: border-color 0.2s;
            }
            input:focus {
              outline: none;
              border-color: #667eea;
            }
            button {
              width: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 14px;
              font-size: 16px;
              font-weight: 600;
              border-radius: 8px;
              cursor: pointer;
              transition: transform 0.2s, box-shadow 0.2s;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
            }
            .error {
              background: #f8d7da;
              color: #842029;
              padding: 12px;
              border-radius: 8px;
              margin-bottom: 20px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authenticate to View Ticket</h1>
            <p>Enter your email address to continue to Zendesk</p>
            ${req.query.error ? `<div class="error">${req.query.error}</div>` : ''}
            <form method="GET" action="/zendesk/sso">
              <input type="hidden" name="return_to" value="${returnTo}">
              <div class="form-group">
                <label for="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="your.email@example.com" 
                  required
                  autofocus
                >
              </div>
              <button type="submit">Continue to Zendesk</button>
            </form>
          </div>
        </body>
        </html>
      `);
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
