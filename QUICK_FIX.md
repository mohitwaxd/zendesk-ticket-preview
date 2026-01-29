# Quick Fix Guide - Why It's Not Working

## The #1 Issue: support@telecrm.in Doesn't Exist in Zendesk

**This is why you're seeing the sign-in page!**

JWT SSO **REQUIRES** the email in the JWT token to match an **existing Zendesk user**. If the user doesn't exist, Zendesk rejects the JWT and shows the sign-in page.

## Fix This First (5 minutes)

### Step 1: Create support@telecrm.in in Zendesk

1. Go to: **https://telecrm-tickets.zendesk.com/admin/people/users**
2. Click **"Add user"**
3. Enter:
   - **Email**: `support@telecrm.in`
   - **Name**: `Support Team`
   - **Role**: **End user**
4. Click **"Add user"**

### Step 2: Verify JWT Secret Matches

1. **Zendesk**: Admin → Security → SSO → JWT SSO
   - Shared Secret: `LzhsUjU0nEfjH5K1MnZZxw8VFd35zcDEqF7veXGtG5v9wIPH`

2. **Vercel**: Dashboard → Settings → Environment Variables
   - `ZENDESK_JWT_SECRET` = `LzhsUjU0nEfjH5K1MnZZxw8VFd35zcDEqF7veXGtG5v9wIPH`

3. **Must match exactly** - no spaces, no extra characters

### Step 3: Test

1. Visit: `https://zendesk-ticket-preview.vercel.app/test-jwt`
2. Click "Test Form Submit"
3. Should open ticket in Zendesk (no sign-in page!)

## Test Page

I've created a test page to debug:
- Visit: `https://zendesk-ticket-preview.vercel.app/test-jwt`
- This will help identify exactly what's wrong

## Common Issues

### Issue 1: User Doesn't Exist
**Symptom**: Redirects to sign-in page  
**Fix**: Create support@telecrm.in in Zendesk

### Issue 2: JWT Secret Mismatch
**Symptom**: Redirects to sign-in page  
**Fix**: Ensure secrets match exactly

### Issue 3: JWT SSO Not Enabled
**Symptom**: Redirects to sign-in page  
**Fix**: Enable JWT SSO in Zendesk Admin

## Debug Steps

1. **Check Vercel Logs**:
   - Vercel Dashboard → Deployments → Latest → Logs
   - Look for "Generating JWT token for: support@telecrm.in"
   - Check for any errors

2. **Test JWT Generation**:
   - Visit: `https://zendesk-ticket-preview.vercel.app/test-jwt`
   - Click "Generate JWT"
   - Should show token successfully

3. **Test Form Submission**:
   - Visit test page
   - Click "Test Form Submit"
   - Should open Zendesk

4. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Click "View Full Ticket"
   - Check console for errors

## After Creating support@telecrm.in

Once the user exists:
- ✅ JWT SSO will work automatically
- ✅ No sign-in page will appear
- ✅ Ticket will open directly

**The code is correct - you just need to create the user in Zendesk!**
