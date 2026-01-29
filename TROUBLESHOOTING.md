# Troubleshooting Guide

## "Access denied to ticket" Error (403)

This error means your Zendesk API connection is working, but the agent account doesn't have permission to view the ticket.

### Common Causes & Solutions

#### 1. Agent Account Doesn't Have Access to Ticket's Organization

**Problem:** The ticket belongs to an organization that the agent account can't access.

**Solution:**
1. Log into Zendesk as an admin
2. Go to the ticket (ticket #2405)
3. Check which organization the ticket belongs to
4. Go to **Admin** → **People** → **Organizations**
5. Find the organization and ensure your agent account (`ZENDESK_EMAIL`) has access
6. Or add the agent to the organization

#### 2. Agent Role Doesn't Have Sufficient Permissions

**Problem:** The agent account role doesn't have permission to view tickets.

**Solution:**
1. Go to **Admin** → **People** → **Team members**
2. Find your agent account (the email in `ZENDESK_EMAIL`)
3. Check the agent's role:
   - **Admin**: Has access to all tickets ✅
   - **Agent**: Should have access to most tickets ✅
   - **Light Agent**: May have limited access ⚠️
4. If needed, upgrade the agent role or adjust permissions

#### 3. Ticket is in a Restricted View

**Problem:** The ticket might be in a view that the agent doesn't have access to.

**Solution:**
1. Check if the ticket is in a restricted view
2. Move the ticket to a view the agent can access
3. Or grant the agent access to the view

#### 4. Ticket is Private or Restricted

**Problem:** The ticket might have special restrictions.

**Solution:**
1. Open the ticket in Zendesk
2. Check if there are any special restrictions
3. Ensure the agent account can view it directly in Zendesk first

### Quick Test Steps

1. **Verify Agent Can Access Ticket in Zendesk:**
   - Log into Zendesk using the same email as `ZENDESK_EMAIL`
   - Try to open ticket #2405 directly
   - If you can't see it in Zendesk, the API won't work either

2. **Test with a Different Ticket:**
   - Try a ticket you know the agent can access
   - If that works, the issue is specific to ticket #2405

3. **Check API Token Permissions:**
   - Go to **Admin** → **Apps and integrations** → **APIs** → **Zendesk API**
   - Verify the API token is active
   - Ensure it's associated with the correct agent account

4. **Verify Environment Variables:**
   - In Vercel, check that `ZENDESK_EMAIL` matches the agent account
   - Ensure `ZENDESK_API_TOKEN` is correct and active

### Recommended Solution

**Use an Admin Account for API Access:**

For the public preview feature, it's recommended to use an **Admin** or **Agent** account with broad access:

1. Create a dedicated service account in Zendesk (or use an existing admin)
2. Generate an API token for that account
3. Update `ZENDESK_EMAIL` in Vercel to use that account
4. Update `ZENDESK_API_TOKEN` with the new token

This ensures the API can access tickets for the public preview feature.

### Alternative: Use OAuth Instead of API Token

If you need more granular control, consider using OAuth instead of API tokens, but this requires additional setup.

---

## Other Common Errors

### "Ticket not found" (404)
- Verify the ticket ID exists in your Zendesk
- Check that you're using the correct Zendesk subdomain

### "Cannot connect to Zendesk" (ENOTFOUND)
- Verify `ZENDESK_SUBDOMAIN` is set correctly (just the subdomain, no URL)
- Check network connectivity

### "Invalid JWT token"
- Ensure `ZENDESK_JWT_SECRET` in Vercel matches Zendesk Shared Secret exactly
- No extra spaces or line breaks
- Redeploy after updating
