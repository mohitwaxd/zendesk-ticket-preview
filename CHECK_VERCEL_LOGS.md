# How to Check Vercel Logs for JWT SSO Issues

## Step 1: Access Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Click on your project: `zendesk-ticket-preview`
3. Click **"Deployments"** tab
4. Click on the **latest deployment** (top of the list)
5. Click **"Logs"** tab

## Step 2: Test the SSO Endpoint

1. Visit: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
2. Click **"View Full Ticket"** button
3. Immediately go back to Vercel logs

## Step 3: Look for These Log Messages

You should see these log entries:

### ✅ Success Logs (What you should see):

```
Generating JWT token for: support@telecrm.in
JWT Secret configured: Yes
JWT token generated successfully, length: [number]
Redirecting to Zendesk SSO...
Using email: support@telecrm.in
Return to: /hc/en-us/requests/2405
JWT SSO URL: https://telecrm-tickets.zendesk.com/access/jwt?jwt=TOKEN_HIDDEN&return_to=...
```

### ❌ Error Logs (What might be wrong):

**If you see:**
```
Error: ZENDESK_JWT_SECRET environment variable is required
```
**Fix:** Add `ZENDESK_JWT_SECRET` to Vercel environment variables

**If you see:**
```
Error: ZENDESK_SUBDOMAIN environment variable is required
```
**Fix:** Add `ZENDESK_SUBDOMAIN` to Vercel environment variables

**If you see:**
```
Error in Zendesk SSO: [error message]
```
**Fix:** Check the error message and stack trace

## Step 4: Test JWT Token Locally

Run this command in your project directory:

```bash
node test-jwt.js
```

This will:
- Test JWT token generation
- Show the SSO URL being built
- Verify configuration
- Show decoded token payload

## Step 5: Manual SSO URL Test

1. Get the SSO URL from logs or test script
2. Copy the full URL (with actual token)
3. Paste in browser
4. See what happens:
   - ✅ Opens ticket → JWT SSO working!
   - ❌ Shows sign-in → User doesn't exist or JWT SSO not enabled
   - ❌ Shows error → JWT secret mismatch

## Common Issues Found in Logs

### Issue 1: Missing Environment Variable
**Log shows:** `Error: ZENDESK_JWT_SECRET environment variable is required`
**Fix:** Add to Vercel → Settings → Environment Variables

### Issue 2: JWT Secret Not Configured
**Log shows:** `JWT Secret configured: No`
**Fix:** Check `ZENDESK_JWT_SECRET` in Vercel

### Issue 3: Token Generation Fails
**Log shows:** `Error in Zendesk SSO: [JWT error]`
**Fix:** Check JWT secret format, ensure it's a valid string

## Share Logs for Help

If you need help, share:
1. The log output from Vercel (especially error messages)
2. Output from `node test-jwt.js`
3. What happens when you visit the SSO URL directly
