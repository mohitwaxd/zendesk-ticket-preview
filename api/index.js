/**
 * Vercel Serverless Function Entry Point
 * 
 * This file is the entry point for Vercel's serverless functions.
 * It exports the Express app to handle all routes.
 */

const app = require('../server');

// Export the Express app for Vercel
module.exports = app;
