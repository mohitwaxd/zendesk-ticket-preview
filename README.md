# Zendesk Ticket Preview with JWT SSO

A Node.js + Express application that provides a public ticket preview page and secure Zendesk SSO authentication.

## Features

- **Public Ticket Preview**: View ticket details and public comments without authentication
- **Secure SSO**: JWT-based Single Sign-On to Zendesk Help Center
- **Security First**: Sensitive data is filtered out, authentication happens server-side only
- **One-Page App**: Simple, clean interface for ticket preview

## Architecture

### Security Model

1. **Public Preview** (`GET /api/public/ticket/:ticketId`)
   - Uses agent credentials to fetch ticket data
   - Removes sensitive fields (requester email, CC list, internal notes, user IDs)
   - Only returns public comments

2. **SSO Authentication** (`GET /zendesk/sso`)
   - User must be authenticated (email from backend session)
   - Generates short-lived JWT tokens (5 minutes)
   - Each token has unique `jti` (prevents reuse)
   - Validates `return_to` parameter (must start with `/hc/`)
   - Redirects to Zendesk JWT SSO endpoint

3. **Zendesk Authorization**
   - Zendesk enforces final authorization
   - Users only see tickets they're allowed to see (requester/CC)
   - No public access to Zendesk pages

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Zendesk credentials:

```bash
cp .env.example .env
```

Required variables:
- `ZENDESK_SUBDOMAIN`: Your Zendesk subdomain
- `ZENDESK_EMAIL`: Agent email for API authentication
- `ZENDESK_API_TOKEN`: API token (generate in Zendesk Admin)
- `ZENDESK_JWT_SECRET`: JWT SSO secret (configure in Zendesk Admin)

### 3. Zendesk Configuration

#### API Token Setup

1. Go to Zendesk Admin > Apps and integrations > APIs > Zendesk API
2. Enable Token Access
3. Create a new API token
4. Copy the token to `.env` as `ZENDESK_API_TOKEN`

#### JWT SSO Setup

1. Go to Zendesk Admin > Security > SSO
2. Enable JWT SSO
3. Set the Shared Secret (copy to `.env` as `ZENDESK_JWT_SECRET`)
4. Configure JWT settings:
   - Remote login URL: `https://your-domain.com/zendesk/sso`
   - JWT identifier: `email`

### 4. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## Deployment to Vercel

### Prerequisites

1. Install Vercel CLI (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. Have a Vercel account (sign up at [vercel.com](https://vercel.com))

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the project settings

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add all required variables:
     - `ZENDESK_SUBDOMAIN`
     - `ZENDESK_EMAIL`
     - `ZENDESK_API_TOKEN`
     - `ZENDESK_JWT_SECRET`
     - `NODE_ENV=production` (optional, defaults to production)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Set environment variables when prompted, or add them later in dashboard

3. **Set Environment Variables**
   ```bash
   vercel env add ZENDESK_SUBDOMAIN
   vercel env add ZENDESK_EMAIL
   vercel env add ZENDESK_API_TOKEN
   vercel env add ZENDESK_JWT_SECRET
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Update Zendesk Configuration

After deployment, update your Zendesk JWT SSO settings:

1. Go to Zendesk Admin > Security > SSO
2. Update **Remote login URL** to:
   ```
   https://your-project.vercel.app/zendesk/sso
   ```
   Or if you have a custom domain:
   ```
   https://yourdomain.com/zendesk/sso
   ```

### Testing Deployment

1. Visit your deployed URL:
   ```
   https://your-project.vercel.app/ticket/12345
   ```

2. Test the SSO flow:
   - Click "View Full Ticket"
   - Should redirect to Zendesk with authentication

### Important Notes for Vercel

- **Serverless Functions**: The app runs as serverless functions on Vercel
- **Cold Starts**: First request may be slower due to cold start
- **Environment Variables**: Must be set in Vercel dashboard (not `.env` file)
- **Session Storage**: In-memory sessions won't persist across serverless invocations
  - For production, use Redis or database for session storage
  - Or use Vercel's KV store or external session service
- **HTTPS**: Vercel provides HTTPS automatically
- **Custom Domain**: You can add a custom domain in Vercel project settings

## Usage

### Public Ticket Preview

Visit:
```
http://localhost:3000/ticket/12345
```

Replace `12345` with your actual ticket ID.

This page shows:
- Ticket subject and status
- Priority and timestamps
- Public comments (no internal notes)
- "View Full Ticket" button

### View Full Ticket in Zendesk

1. Click "View Full Ticket" button
2. User must be authenticated (email from session)
3. System generates JWT token
4. Redirects to Zendesk Help Center
5. Zendesk shows only tickets user is allowed to see

### Authentication (Demo)

For demo purposes, you can set a session by calling:

```bash
curl -X POST http://localhost:3000/zendesk/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "name": "John Doe"}'
```

**Note**: In production, replace this with proper authentication:
- Email verification
- Password authentication
- OAuth flow
- etc.

## API Endpoints

### `GET /api/public/ticket/:ticketId`

Public endpoint to preview ticket details.

**Response:**
```json
{
  "success": true,
  "data": {
    "ticketId": 12345,
    "subject": "Ticket Subject",
    "status": "open",
    "priority": "normal",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "description": "Ticket description",
    "comments": [
      {
        "id": 1,
        "body": "Comment text",
        "created_at": "2024-01-01T00:00:00Z",
        "author_name": "John Doe"
      }
    ]
  }
}
```

### `GET /zendesk/sso?return_to=/hc/en-us/requests/12345`

Zendesk JWT SSO endpoint.

**Query Parameters:**
- `return_to`: Path to redirect after SSO (must start with `/hc/`)

**Response:**
- Redirects to Zendesk SSO URL with JWT token

### `POST /zendesk/authenticate`

Demo endpoint to set user session.

**Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Security Features

✅ **No Public Zendesk Pages**: All Zendesk pages remain protected  
✅ **Backend-Only API Calls**: Zendesk API only called from backend  
✅ **No Frontend Identity**: Email comes from backend session, never frontend  
✅ **JWT Security**: Short-lived tokens (5 min), unique `jti`, no reuse  
✅ **URL Validation**: `return_to` must start with `/hc/`  
✅ **Data Sanitization**: Sensitive fields removed before sending to frontend  
✅ **Secret Protection**: Zendesk secrets never exposed to frontend  

## Project Structure

```
.
├── api/
│   └── index.js             # Vercel serverless function entry point
├── server.js                 # Main Express server
├── vercel.json               # Vercel configuration
├── config/
│   └── zendesk.js           # Zendesk configuration
├── services/
│   ├── zendeskService.js    # Zendesk API client
│   └── jwtService.js        # JWT SSO service
├── routes/
│   ├── api.js               # Public API routes
│   └── zendesk.js           # Zendesk SSO routes
├── public/
│   └── ticket.html          # Frontend ticket preview page
├── .env.example             # Environment variables template
├── package.json             # Dependencies
└── README.md                # This file
```

## Production Considerations

1. **Session Management**: Replace in-memory session store with Redis or database
2. **Authentication**: Implement proper authentication flow (OAuth, email verification, etc.)
3. **Error Handling**: Add comprehensive error logging and monitoring
4. **Rate Limiting**: Add rate limiting to prevent abuse
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS if needed for cross-origin requests
7. **Environment Variables**: Use secure secret management (AWS Secrets Manager, etc.)

## Troubleshooting

### "Ticket not found"
- Verify the ticket ID exists in Zendesk
- Check that the API token has read permissions

### "Access denied to ticket"
- The API token may not have sufficient permissions
- Verify the agent account has access to the ticket

### SSO redirect fails
- Verify `ZENDESK_JWT_SECRET` matches Zendesk configuration
- Check that JWT SSO is enabled in Zendesk
- Ensure `return_to` parameter starts with `/hc/`

### Session not working
- Check that cookies are enabled
- In production, ensure secure cookies are used with HTTPS

## License

ISC
