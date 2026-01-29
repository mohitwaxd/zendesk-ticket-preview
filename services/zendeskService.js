/**
 * Zendesk API Service
 * 
 * Handles all Zendesk API interactions using agent credentials.
 * This service is only used on the backend to fetch ticket data.
 */

const axios = require('axios');
const zendeskConfig = require('../config/zendesk');

class ZendeskService {
  constructor() {
    // Create axios instance with authentication
    this.client = axios.create({
      baseURL: zendeskConfig.apiUrl,
      auth: {
        username: `${zendeskConfig.email}/token`,
        password: zendeskConfig.apiToken
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Fetch ticket details and comments
   * @param {string} ticketId - Zendesk ticket ID
   * @returns {Promise<Object>} Ticket data with comments
   */
  async getTicket(ticketId) {
    try {
      // Fetch ticket details
      const ticketResponse = await this.client.get(`/tickets/${ticketId}.json`);
      const ticket = ticketResponse.data.ticket;

      // Fetch ticket comments
      const commentsResponse = await this.client.get(`/tickets/${ticketId}/comments.json`);
      const comments = commentsResponse.data.comments || [];

      return {
        ticket,
        comments
      };
    } catch (error) {
      if (error.response) {
        // Zendesk API error
        if (error.response.status === 404) {
          throw new Error('Ticket not found');
        }
        if (error.response.status === 403) {
          const errorDetail = error.response.data?.error || error.response.data?.description || '';
          throw new Error(`Access denied to ticket. The agent account (${zendeskConfig.email}) may not have permission to view this ticket. Ensure the agent has access to the ticket's organization and the ticket is not restricted. Details: ${errorDetail}`);
        }
        throw new Error(`Zendesk API error: ${error.response.status} - ${error.response.statusText}`);
      }
      
      // Network/DNS errors
      if (error.code === 'ENOTFOUND' || error.message.includes('ENOTFOUND')) {
        const subdomain = zendeskConfig.subdomain;
        throw new Error(`Cannot connect to Zendesk. Check ZENDESK_SUBDOMAIN (currently: "${subdomain}"). It should be just the subdomain (e.g., "mycompany"), not a full URL.`);
      }
      
      throw new Error(`Failed to fetch ticket: ${error.message}`);
    }
  }

  /**
   * Sanitize ticket data for public preview
   * Removes sensitive information that should not be exposed publicly
   * 
   * @param {Object} ticket - Raw ticket data from Zendesk
   * @param {Array} comments - Raw comments array from Zendesk
   * @returns {Object} Sanitized ticket data
   */
  sanitizeTicketForPreview(ticket, comments) {
    // Filter only public comments (not internal notes)
    const publicComments = comments
      .filter(comment => comment.public === true)
      .map(comment => ({
        id: comment.id,
        body: comment.body,
        created_at: comment.created_at,
        author_name: comment.author_name || 'Anonymous',
        // Do not include author_id or any user identifiers
      }));

    // Return only safe, public fields
    return {
      ticketId: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority || null,
      created_at: ticket.created_at,
      updated_at: ticket.updated_at,
      description: ticket.description || '',
      // Explicitly exclude:
      // - requester_id
      // - requester email
      // - CC list
      // - assignee information
      // - organization
      // - any user IDs
      comments: publicComments
    };
  }
}

module.exports = new ZendeskService();
