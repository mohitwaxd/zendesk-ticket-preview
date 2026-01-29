/**
 * Main Express Server
 * 
 * This server provides:
 * 1. Public ticket preview API
 * 2. Frontend page for ticket preview
 * 3. Zendesk JWT SSO authentication
 */

require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const apiRoutes = require('./routes/api');
const zendeskRoutes = require('./routes/zendesk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Ticket preview page route
app.get('/ticket/:ticketId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ticket.html'));
});

// Routes
app.use('/api', apiRoutes);
app.use('/zendesk', zendeskRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server (only if not running on Vercel)
// Vercel handles the serverless function execution
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
