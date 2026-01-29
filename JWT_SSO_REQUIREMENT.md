# JWT SSO Requirement: support@telecrm.in Must Be a Zendesk User

## Important: Why Sign-In Page Appears

If you're seeing the sign-in page instead of automatic authentication, it's because **support@telecrm.in must exist as a user in Zendesk** for JWT SSO to work.

## The Problem

JWT SSO requires the email in the JWT token to match an **existing Zendesk user**. If support@telecrm.in is not a Zendesk user, Zendesk will:
1. Reject the JWT token
2. Redirect to the sign-in page
3. Show the login form

## Solution: Create support@telecrm.in as Zendesk User

### Option 1: Create as End User (Recommended)

1. Go to Zendesk Admin → **People** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email**: `support@telecrm.in`
   - **Name**: `Support Team`
   - **Role**: **End user** (or Agent if needed)
4. Click **"Add user"**
5. The user will receive an email to set password (optional for JWT SSO)

### Option 2: Use Existing Agent Email

If you have an existing agent/admin email that can access tickets, update the code to use that email instead:

1. In `routes/zendesk.js`, change:
   ```javascript
   const user = {
     email: 'your-agent@telecrm.in', // Use existing Zendesk user email
     name: 'Support'
   };
   ```

2. Update Vercel environment variable if needed

## Verify JWT SSO Configuration

1. **Zendesk Admin** → **Security** → **SSO** → **JWT SSO**
2. Ensure:
   - ✅ JWT SSO is **enabled**
   - ✅ **Shared Secret** matches `ZENDESK_JWT_SECRET` in Vercel exactly
   - ✅ **Remote login URL** is: `https://zendesk-ticket-preview.vercel.app/zendesk/sso`

## Test After Setup

1. Visit: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
2. Click **"View Full Ticket"**
3. Should redirect directly to Zendesk ticket (no sign-in page)

## Troubleshooting

### Still seeing sign-in page?

1. **Check if support@telecrm.in exists in Zendesk:**
   - Admin → People → Users
   - Search for `support@telecrm.in`
   - If not found, create it (see above)

2. **Check JWT Secret:**
   - Must match exactly between Zendesk and Vercel
   - No extra spaces or characters
   - Check Vercel logs for JWT generation errors

3. **Check Vercel Logs:**
   - Look for "JWT token generated successfully"
   - Check the SSO URL being built
   - Verify email is `support@telecrm.in`

4. **Test JWT SSO directly:**
   - Visit: `https://telecrm-tickets.zendesk.com/access/jwt?jwt=TOKEN&return_to=/hc/en-us/requests/2405`
   - Replace TOKEN with a generated JWT (check logs)

## Current Flow

1. User clicks "View Full Ticket"
2. System generates JWT with `support@telecrm.in` email
3. Redirects to: `https://telecrm-tickets.zendesk.com/access/jwt?jwt=TOKEN&return_to=/hc/en-us/requests/2405`
4. Zendesk validates JWT and authenticates user
5. Opens ticket directly

**If step 4 fails (user doesn't exist), Zendesk shows sign-in page.**
