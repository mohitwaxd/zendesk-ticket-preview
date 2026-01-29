/**
 * Public API Routes
 * 
 * These endpoints provide public ticket preview functionality.
 * Sensitive data is filtered out before returning to the client.
 */

const express = require('express');
const router = express.Router();
const zendeskService = require('../services/zendeskService');

/**
 * GET /api/public/ticket/:ticketId
 * 
 * Public endpoint to preview ticket details and public comments.
 * 
 * Security:
 * - Uses agent credentials to fetch data
 * - Removes sensitive fields (requester email, CC, internal notes, user IDs)
 * - Only returns public comments
 * 
 * @param {string} ticketId - Zendesk ticket ID
 */
router.get('/public/ticket/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    // Validate ticket ID
    if (!ticketId || isNaN(parseInt(ticketId))) {
      return res.status(400).json({
        error: 'Invalid ticket ID'
      });
    }

    // Fetch ticket from Zendesk using agent credentials
    const { ticket, comments } = await zendeskService.getTicket(ticketId);

    // Sanitize data - remove sensitive information
    const sanitizedData = zendeskService.sanitizeTicketForPreview(ticket, comments);

    // Return public preview data
    res.json({
      success: true,
      data: sanitizedData
    });

  } catch (error) {
    console.error('Error fetching ticket:', error);

    // Handle specific error cases
    if (error.message === 'Ticket not found') {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    if (error.message === 'Access denied to ticket') {
      return res.status(403).json({
        error: 'Access denied to ticket'
      });
    }

    // Generic error response
    res.status(500).json({
      error: 'Failed to fetch ticket',
      message: error.message
    });
  }
});

module.exports = router;
