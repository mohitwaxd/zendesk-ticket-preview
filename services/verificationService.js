/**
 * Verification Service
 * 
 * Manages user verification by support@telecrm.in
 * In production, use a database instead of in-memory storage
 */

const { v4: uuidv4 } = require('uuid');

// In-memory storage (in production, use database)
const pendingVerifications = new Map(); // token -> { email, requestedAt, ticketId }
const verifiedUsers = new Set(); // Set of verified email addresses

// Support email that can verify users
const SUPPORT_EMAIL = 'support@telecrm.in';

class VerificationService {
  /**
   * Request access for a user
   * Generates a verification token and sends it to support@telecrm.in
   * 
   * @param {string} email - User email requesting access
   * @param {string} ticketId - Optional ticket ID
   * @returns {string} Verification token
   */
  requestAccess(email, ticketId = null, returnTo = null) {
    const token = uuidv4();
    pendingVerifications.set(token, {
      email: email.toLowerCase().trim(),
      requestedAt: new Date(),
      ticketId: ticketId,
      returnTo: returnTo || (ticketId ? `/hc/en-us/requests/${ticketId}` : '/hc/en-us')
    });

    // In production, send email to support@telecrm.in with verification link
    // For now, return the token
    return token;
  }

  /**
   * Verify a user (called by support@telecrm.in)
   * 
   * @param {string} token - Verification token
   * @param {string} verifierEmail - Email of person verifying (must be support@telecrm.in)
   * @returns {boolean} True if verified successfully
   */
  verifyUser(token, verifierEmail) {
    if (verifierEmail.toLowerCase() !== SUPPORT_EMAIL) {
      throw new Error('Only support@telecrm.in can verify users');
    }

    const verification = pendingVerifications.get(token);
    if (!verification) {
      throw new Error('Invalid verification token');
    }

    // Check if verification is expired (24 hours)
    const hoursSinceRequest = (new Date() - verification.requestedAt) / (1000 * 60 * 60);
    if (hoursSinceRequest > 24) {
      pendingVerifications.delete(token);
      throw new Error('Verification token expired');
    }

    // Add to verified users
    verifiedUsers.add(verification.email);

    // Remove from pending
    pendingVerifications.delete(token);

    return true;
  }

  /**
   * Check if a user is verified
   * 
   * @param {string} email - User email
   * @returns {boolean} True if verified
   */
  isVerified(email) {
    return verifiedUsers.has(email.toLowerCase().trim());
  }

  /**
   * Get pending verification details
   * 
   * @param {string} token - Verification token
   * @returns {Object|null} Verification details or null
   */
  getPendingVerification(token) {
    return pendingVerifications.get(token) || null;
  }

  /**
   * Get all pending verifications (for admin view)
   * 
   * @returns {Array} Array of pending verifications
   */
  getAllPendingVerifications() {
    return Array.from(pendingVerifications.entries()).map(([token, data]) => ({
      token,
      ...data
    }));
  }

  /**
   * Get all verified users (for admin view)
   * 
   * @returns {Array} Array of verified email addresses
   */
  getAllVerifiedUsers() {
    return Array.from(verifiedUsers);
  }

  /**
   * Revoke verification for a user
   * 
   * @param {string} email - User email to revoke
   * @returns {boolean} True if revoked
   */
  revokeVerification(email) {
    return verifiedUsers.delete(email.toLowerCase().trim());
  }
}

module.exports = new VerificationService();
