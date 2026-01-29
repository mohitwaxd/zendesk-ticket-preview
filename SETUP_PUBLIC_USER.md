# Setup Guide: Public User JWT SSO

## Use Case
- **support@telecrm.in** is a public/end user in Zendesk who creates tickets
- They receive public preview links: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
- When they click "View Full Ticket", JWT SSO authenticates them automatically
- They can then view their tickets in Zendesk Help Center

## Step 1: Create support@telecrm.in as End User in Zendesk

1. Go to: **https://telecrm-tickets.zendesk.com/admin/people/users**
2. Click **"Add user"**
3. Fill in:
   - **Email**: `support@telecrm.in`
   - **Name**: `Support Team` (or any name)
   - **Role**: **End user** (this is important - they're a public user, not an agent)
4. Click **"Add user"**

**Important:** Make sure the role is **"End user"** (not Agent or Admin) since they're a public user who creates tickets.

## Step 2: Verify JWT SSO Configuration

1. Go to: **https://telecrm-tickets.zendesk.com/admin/security/sso**
2. Find **"JSON Web Token"** configuration
3. Verify:
   - ✅ **Remote login URL**: `https://zendesk-ticket-preview.vercel.app/zendesk/sso`
   - ✅ **Shared Secret**: `LzhsUjU0nEfjH5K1MnZZxw8VFd35zcDEqF7veXGtG5v9wIPH`
   - ✅ JWT SSO is **enabled**

## Step 3: Verify Vercel Environment Variables

1. Go to: **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Verify these are set:
   - `ZENDESK_SUBDOMAIN` = `telecrm-tickets`
   - `ZENDESK_EMAIL` = (your agent email for API)
   - `ZENDESK_API_TOKEN` = (your API token)
   - `ZENDESK_JWT_SECRET` = `LzhsUjU0nEfjH5K1MnZZxw8VFd35zcDEqF7veXGtG5v9wIPH`

## Step 4: Test the Flow

1. **Create a ticket** in Zendesk as support@telecrm.in (or any user)
2. **Get the ticket ID** (e.g., 2405)
3. **Visit**: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
4. **Click**: "View Full Ticket" button
5. **Expected**: Should redirect directly to Zendesk ticket (no sign-in page)
6. **Result**: support@telecrm.in is authenticated and sees the ticket

## How It Works

1. User visits public preview: `/ticket/2405`
2. Clicks "View Full Ticket"
3. System generates JWT token with `support@telecrm.in` email
4. Redirects to: `https://telecrm-tickets.zendesk.com/access/jwt?jwt=TOKEN&return_to=/hc/en-us/requests/2405`
5. Zendesk validates JWT and authenticates support@telecrm.in
6. User sees the ticket in Zendesk Help Center

## Current Code Configuration

The code is already configured for this:
- Uses `support@telecrm.in` for all JWT SSO authentications
- No email input required - automatic authentication
- One-click ticket access

## Troubleshooting

### Still seeing sign-in page?
- ✅ Verify support@telecrm.in exists in Zendesk as **End user**
- ✅ Verify JWT SSO is enabled in Zendesk
- ✅ Verify JWT secret matches exactly in Vercel and Zendesk
- ✅ Check Vercel logs for JWT generation errors

### User can't see ticket?
- Verify support@telecrm.in is the requester or CC'd on the ticket
- Check ticket permissions in Zendesk
- Ensure ticket is not private/restricted

## This is Standard Zendesk Implementation

This setup follows Zendesk's standard JWT SSO pattern:
- Public users can create tickets
- They receive preview links
- JWT SSO authenticates them automatically
- They can view their tickets in Help Center

Once support@telecrm.in is created as an End user in Zendesk, everything will work automatically!
