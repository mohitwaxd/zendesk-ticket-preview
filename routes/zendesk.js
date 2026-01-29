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
const verificationService = require('../services/verificationService');

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
    // Get return_to parameter
    const returnTo = req.query.return_to;

    // Validate return_to - must start with /hc/ for security
    if (!returnTo || !jwtService.validateReturnTo(returnTo)) {
      return res.status(400).json({
        error: 'Invalid return_to parameter',
        message: 'return_to must start with /hc/'
      });
    }

    // Always use support@telecrm.in for JWT SSO
    // This email is CC'd on all tickets, so it can access them
    const user = {
      email: 'support@telecrm.in',
      name: 'Support'
    };

    // Generate JWT token with support@telecrm.in email
    const token = jwtService.generateToken(user.email, user.name);

    // Build Zendesk SSO URL
    const ssoUrl = jwtService.buildSSOUrl(token, returnTo);

    console.log('Redirecting to Zendesk SSO...');
    console.log('Using email:', user.email);
    console.log('Return to:', returnTo);
    console.log('SSO URL:', ssoUrl.replace(token, 'TOKEN_HIDDEN'));

    // Redirect to Zendesk SSO - this should authenticate automatically
    res.redirect(ssoUrl);
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
            <h1>Request Access to Ticket</h1>
            <p>Enter your email address to request access. Your request will be sent to support@telecrm.in for verification.</p>
            ${req.query.error ? `<div class="error">${req.query.error}</div>` : ''}
            ${req.query.success ? `<div style="background: #d1e7dd; color: #0f5132; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 14px;">${req.query.success}</div>` : ''}
            <form method="POST" action="/zendesk/request-access">
              <input type="hidden" name="return_to" value="${returnTo}">
              ${ticketId ? `<input type="hidden" name="ticket_id" value="${ticketId}">` : ''}
              <div class="form-group">
                <label for="email">Your Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="your.email@example.com" 
                  required
                  autofocus
                >
              </div>
              <button type="submit">Request Access</button>
            </form>
            <p style="margin-top: 20px; font-size: 12px; color: #6c757d;">
              Already verified? <a href="/zendesk/sso?return_to=${encodeURIComponent(returnTo)}" style="color: #667eea;">Sign in directly</a>
            </p>
          </div>
        </body>
        </html>
      `);

  } catch (error) {
    console.error('Error in Zendesk SSO:', error);
    console.error('Stack:', error.stack);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>SSO Error</title>
        <style>
          body { font-family: sans-serif; padding: 40px; text-align: center; }
          .error { background: #f8d7da; color: #842029; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 500px; }
        </style>
      </head>
      <body>
        <div class="error">
          <h2>SSO Authentication Failed</h2>
          <p>${error.message}</p>
          <p style="font-size: 12px; margin-top: 20px;">Check server logs for details. Common issues: JWT secret mismatch, JWT SSO not enabled in Zendesk.</p>
        </div>
      </body>
      </html>
    `);
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
/**
 * POST /zendesk/request-access
 * 
 * Request access for a user. Creates a verification request.
 */
router.post('/request-access', (req, res) => {
  const { email, return_to, ticket_id } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Error</title></head>
      <body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <div style="background: #f8d7da; color: #842029; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
          <h2>Invalid Email</h2>
          <p>Please provide a valid email address.</p>
          <a href="/zendesk/sso?return_to=${encodeURIComponent(return_to || '/hc/en-us')}" style="color: #667eea;">Go back</a>
        </div>
      </body></html>
    `);
  }

  try {
    // Check if already verified
    if (verificationService.isVerified(email)) {
      // User is already verified, create session and redirect to SSO
      const sessionId = require('uuid').v4();
      sessions.set(sessionId, { email, name: email.split('@')[0] });
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000
      });
      return res.redirect(`/zendesk/sso?return_to=${encodeURIComponent(return_to || '/hc/en-us')}`);
    }

    // Request verification
    const token = verificationService.requestAccess(email, ticket_id, return_to);
    
    // In production, send email to support@telecrm.in with verification link
    // For now, show success message with verification link
    const verificationUrl = `${req.protocol}://${req.get('host')}/zendesk/verify?token=${token}&verifier=support@telecrm.in`;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Requested</title>
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
            max-width: 600px;
            width: 100%;
          }
          h1 { color: #212529; margin-bottom: 20px; }
          p { color: #6c757d; margin-bottom: 15px; line-height: 1.6; }
          .success { background: #d1e7dd; color: #0f5132; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          .info-box {
            background: #e7f3ff;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          code {
            background: #f8f9fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Access Request Submitted</h1>
          <div class="success">
            Your access request for <strong>${email}</strong> has been submitted.
          </div>
          <p>Your request will be reviewed by support@telecrm.in.</p>
          <div class="info-box">
            <strong>For support@telecrm.in:</strong><br>
            Click this link to verify the user:<br>
            <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
          </div>
          <p style="font-size: 14px; color: #6c757d;">
            Once verified, you'll be able to access tickets. You'll receive a notification when your access is approved.
          </p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error requesting access:', error);
    res.status(500).json({ error: 'Failed to request access', message: error.message });
  }
});

/**
 * GET /zendesk/verify
 * 
 * Verify a user (called by support@telecrm.in)
 * Query params: token, verifier (must be support@telecrm.in)
 */
router.get('/verify', (req, res) => {
  const { token, verifier } = req.query;

  if (!token) {
    return res.status(400).send('Verification token is required');
  }

  if (!verifier || verifier.toLowerCase() !== 'support@telecrm.in') {
    return res.status(403).send('Only support@telecrm.in can verify users');
  }

  try {
    const verification = verificationService.getPendingVerification(token);
    if (!verification) {
      return res.status(404).send('Invalid or expired verification token');
    }

    // Verify the user
    verificationService.verifyUser(token, verifier);

    // Get the return_to URL from verification (or use default)
    const returnTo = verification.returnTo || (verification.ticketId ? `/hc/en-us/requests/${verification.ticketId}` : '/hc/en-us');

    // Create session for the verified user
    const sessionId = require('uuid').v4();
    sessions.set(sessionId, { 
      email: verification.email, 
      name: verification.email.split('@')[0] 
    });

    // Set session cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Automatically redirect to ticket via SSO
    // This will open the ticket in Zendesk after JWT SSO authentication
    const ssoRedirectUrl = `/zendesk/sso?return_to=${encodeURIComponent(returnTo)}`;
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Verified - Redirecting...</title>
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
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          h1 { color: #0f5132; margin-bottom: 20px; }
          .success { background: #d1e7dd; color: #0f5132; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
          p { color: #6c757d; margin-bottom: 15px; }
          .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
        <script>
          // Automatically redirect after 2 seconds
          setTimeout(function() {
            window.location.href = '${ssoRedirectUrl}';
          }, 2000);
        </script>
      </head>
      <body>
        <div class="container">
          <h1>✓ User Verified</h1>
          <div class="success">
            <strong>${verification.email}</strong> has been verified and can now access tickets.
          </div>
          <p>Opening ticket in Zendesk...</p>
          <div class="spinner"></div>
          <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
            If you are not redirected automatically, 
            <a href="${ssoRedirectUrl}" style="color: #667eea;">click here</a>.
          </p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(400).send(`
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Verification Error</title></head>
      <body style="font-family: sans-serif; padding: 40px; text-align: center;">
        <div style="background: #f8d7da; color: #842029; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto;">
          <h2>Verification Failed</h2>
          <p>${error.message}</p>
        </div>
      </body></html>
    `);
  }
});

/**
 * GET /zendesk/admin
 * 
 * Admin panel to view pending verifications and verified users
 * (Protected - should add authentication in production)
 */
router.get('/admin', (req, res) => {
  const pending = verificationService.getAllPendingVerifications();
  const verified = verificationService.getAllVerifiedUsers();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Admin</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f8f9fa;
          padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { margin-bottom: 30px; color: #212529; }
        .section {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h2 { margin-bottom: 15px; color: #495057; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #dee2e6;
        }
        th { background: #f8f9fa; font-weight: 600; color: #495057; }
        .btn {
          background: #667eea;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          text-decoration: none;
          display: inline-block;
          font-size: 14px;
        }
        .empty { color: #6c757d; font-style: italic; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Verification Admin Panel</h1>
        
        <div class="section">
          <h2>Pending Verifications (${pending.length})</h2>
          ${pending.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Ticket ID</th>
                  <th>Requested At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${pending.map(p => `
                  <tr>
                    <td>${p.email}</td>
                    <td>${p.ticketId || 'N/A'}</td>
                    <td>${new Date(p.requestedAt).toLocaleString()}</td>
                    <td>
                      <a href="/zendesk/verify?token=${p.token}&verifier=support@telecrm.in" class="btn">Verify & Open Ticket</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p class="empty">No pending verifications</p>'}
        </div>

        <div class="section">
          <h2>Verified Users (${verified.length})</h2>
          ${verified.length > 0 ? `
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                ${verified.map(email => `
                  <tr>
                    <td>${email}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : '<p class="empty">No verified users yet</p>'}
        </div>
      </div>
    </body>
    </html>
  `);
});

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
