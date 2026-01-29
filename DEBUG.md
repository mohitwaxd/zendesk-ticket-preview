# Debug Checklist

## What's Not Working?

Please check these and tell me:

1. **What happens when you click "View Full Ticket"?**
   - Does the button show "Opening ticket..."?
   - Does it redirect to Zendesk?
   - Does it show the sign-in page?
   - Any error in browser console (F12)?

2. **Check Browser Console (F12)**
   - Open DevTools → Console tab
   - Click "View Full Ticket"
   - What errors do you see?

3. **Check Network Tab (F12)**
   - Open DevTools → Network tab
   - Click "View Full Ticket"
   - Look for `/zendesk/get-jwt` request
   - What's the response? (200 OK or error?)

4. **Test the JWT Endpoint Directly**
   - Visit: `https://zendesk-ticket-preview.vercel.app/zendesk/get-jwt?return_to=/hc/en-us/requests/2405`
   - What response do you get?

5. **Check Vercel Logs**
   - Vercel Dashboard → Deployments → Latest → Logs
   - Look for "Generating JWT token for: support@telecrm.in"
   - Any errors?

## Common Issues

### Issue 1: JWT Secret Mismatch
**Symptom**: Redirects to sign-in page  
**Check**: Zendesk JWT Secret must match Vercel `ZENDESK_JWT_SECRET` exactly

### Issue 2: JWT SSO Not Enabled
**Symptom**: Redirects to sign-in page  
**Check**: Zendesk Admin → Security → SSO → JWT SSO must be enabled

### Issue 3: Form Not Submitting
**Symptom**: Nothing happens when clicking button  
**Check**: Browser console for JavaScript errors

### Issue 4: CORS or Network Error
**Symptom**: Error in browser console  
**Check**: Network tab for failed requests

## Quick Test

1. Visit: `https://zendesk-ticket-preview.vercel.app/test-jwt`
2. Click "Generate JWT" - should show token
3. Click "Test Form Submit" - should open Zendesk
4. If it opens sign-in page, JWT SSO is not working (check Zendesk config)
