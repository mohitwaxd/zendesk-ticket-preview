# JWT SSO Fix Checklist

## Why You're Seeing the Sign-In Page

When you click "View Full Ticket" and get redirected to the sign-in page, it means **JWT SSO authentication failed**. Zendesk rejected the JWT token and is asking for manual login.

## Required Information to Fix

Please check and provide the following:

### 1. Does support@telecrm.in exist in Zendesk?

**Check:**
- Go to: https://telecrm-tickets.zendesk.com/admin/people/users
- Search for: `support@telecrm.in`
- **Answer:** Does it exist? Yes/No

**If NO:**
- Click "Add user"
- Email: `support@telecrm.in`
- Name: `Support Team`
- Role: **End user** (or Agent)
- Click "Add user"

### 2. Is JWT SSO enabled in Zendesk?

**Check:**
- Go to: https://telecrm-tickets.zendesk.com/admin/security/sso
- Look for "JSON Web Token" configuration
- **Answer:** Is it enabled? Yes/No

**If NO or not configured:**
- Click "Create JSON Web Token configuration" or edit existing
- Configuration name: `JWT SSO`
- Remote login URL: `https://zendesk-ticket-preview.vercel.app/zendesk/sso`
- Shared secret: (see step 3)
- Save

### 3. Does JWT Secret match?

**Check in Zendesk:**
- Admin → Security → SSO → JWT SSO
- Copy the **Shared Secret** value

**Check in Vercel:**
- Go to: https://vercel.com/dashboard
- Your project → Settings → Environment Variables
- Find `ZENDESK_JWT_SECRET`
- Copy the value

**Compare:**
- **Answer:** Do they match exactly? Yes/No
- **Important:** No extra spaces, no line breaks, exact match

**If NO:**
- Update Vercel `ZENDESK_JWT_SECRET` to match Zendesk exactly
- Redeploy the application

### 4. Test JWT SSO Directly

**Get test URL:**
- Visit: `https://zendesk-ticket-preview.vercel.app/diagnostics/jwt-test`
- Copy the `fullSsoUrl` value
- Paste it in your browser
- **Answer:** What happens? (Opens ticket / Shows sign-in / Error message)

## Quick Diagnostic

Visit this URL to see current configuration:
```
https://zendesk-ticket-preview.vercel.app/diagnostics/jwt-test
```

This will show:
- Current JWT configuration
- Test token generation
- SSO URL being built
- Instructions to fix

## Most Common Issues

### Issue 1: User Doesn't Exist
**Symptom:** Redirects to sign-in page  
**Fix:** Create `support@telecrm.in` as a Zendesk user

### Issue 2: JWT SSO Not Enabled
**Symptom:** Redirects to sign-in page  
**Fix:** Enable JWT SSO in Zendesk Admin

### Issue 3: Secret Mismatch
**Symptom:** Redirects to sign-in page  
**Fix:** Ensure `ZENDESK_JWT_SECRET` in Vercel matches Zendesk Shared Secret exactly

### Issue 4: Wrong Email Format
**Symptom:** Redirects to sign-in page  
**Fix:** Ensure email in JWT matches exactly with Zendesk user email (case-sensitive)

## After Fixing

1. **Redeploy Vercel** (if you changed environment variables)
2. **Test again:**
   - Visit: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
   - Click "View Full Ticket"
   - Should redirect directly to ticket (no sign-in page)

## Still Not Working?

Check Vercel logs:
1. Go to Vercel Dashboard → Your project → Deployments
2. Click latest deployment → "Logs" tab
3. Look for:
   - "Generating JWT token for: support@telecrm.in"
   - "JWT token generated successfully"
   - "Redirecting to Zendesk SSO..."
4. Share any error messages you see
