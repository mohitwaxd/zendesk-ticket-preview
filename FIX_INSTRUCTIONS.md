# Fix Instructions - Create support@telecrm.in in Zendesk

## The Problem

**support@telecrm.in does NOT exist in Zendesk**, which is why JWT SSO is failing and redirecting to the sign-in page.

JWT SSO requires the email in the JWT token to match an **existing Zendesk user**. If the user doesn't exist, Zendesk rejects the JWT and shows the sign-in page.

## Solution: Create support@telecrm.in as a Zendesk User

### Step 1: Create the User in Zendesk

1. Go to: **https://telecrm-tickets.zendesk.com/admin/people/users**
2. Click **"Add user"** button (top right)
3. Fill in:
   - **Email**: `support@telecrm.in`
   - **Name**: `Support Team` (or any name)
   - **Role**: Choose one:
     - **End user** (recommended - can view tickets they're CC'd on)
     - **Agent** (if you want them to have agent access)
     - **Admin** (if you want full access)
4. Click **"Add user"**

### Step 2: Verify User Was Created

1. Search for `support@telecrm.in` in the users list
2. Confirm it exists and is active

### Step 3: Test JWT SSO

1. Visit: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
2. Click **"View Full Ticket"**
3. Should now redirect directly to Zendesk ticket (no sign-in page!)

## Alternative: Use Existing Agent Email

If you prefer not to create support@telecrm.in, you can use an existing agent/admin email:

1. Tell me the email address of an existing Zendesk agent/admin
2. I'll update the code to use that email instead
3. That user will be used for all JWT SSO authentications

## Verify JWT Secret in Vercel

Make sure the JWT secret in Vercel matches Zendesk:

1. Go to: **Vercel Dashboard** → Your project → **Settings** → **Environment Variables**
2. Find `ZENDESK_JWT_SECRET`
3. Verify it matches: `LzhsUjU0nEfjH5K1MnZZxw8VFd35zcDEqF7veXGtG5v9wIPH`
4. If it doesn't match, update it and redeploy

## After Creating the User

Once support@telecrm.in exists in Zendesk:
- JWT SSO will work automatically
- Users clicking "View Full Ticket" will be authenticated
- No sign-in page will appear
- Ticket will open directly
