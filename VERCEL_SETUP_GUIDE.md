# Vercel Deployment Setup Guide

Your app is live at: **https://zendesk-ticket-preview.vercel.app/**

## Step 1: Generate a Secure JWT Secret

You need to generate a secure random string to use as your JWT secret. Here are a few options:

### Option A: Using Node.js (Recommended)
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Option B: Using OpenSSL
```bash
openssl rand -hex 32
```

### Option C: Online Generator
Visit: https://www.grc.com/passwords.htm
- Generate a 64-character random password
- Copy it (you'll use this in both Zendesk and Vercel)

**Save this secret** - you'll need it in both Step 2 and Step 3!

---

## Step 2: Configure Zendesk JWT SSO

1. **Log in to your Zendesk Admin panel**
   - Go to: https://your-subdomain.zendesk.com/admin

2. **Navigate to JWT SSO Settings**
   - Go to: **Account** → **Security** → **Single sign-on**
   - Click **"Create JSON Web Token configuration"** (or edit existing)

3. **Fill in the Configuration:**
   - **Configuration name**: `JWT SSO` (or any name you prefer)
   - **Remote login URL**: 
     ```
     https://zendesk-ticket-preview.vercel.app/zendesk/sso
     ```
   - **Remote logout URL**: (leave empty or set if needed)
   - **Update of external IDs?**: Leave as default

4. **Set the Shared Secret:**
   - Find the **"Shared secret"** field
   - Paste the secret you generated in Step 1
   - **IMPORTANT**: This must match exactly with what you'll set in Vercel

5. **Save the Configuration**

---

## Step 3: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Find your project: `zendesk-ticket-preview`
   - Click on it

2. **Navigate to Settings**
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in the sidebar

3. **Add Each Variable:**
   Click **"Add New"** for each of these:

   **a) ZENDESK_SUBDOMAIN**
   - Key: `ZENDESK_SUBDOMAIN`
   - Value: `your-subdomain` (e.g., if your Zendesk URL is `https://mycompany.zendesk.com`, use `mycompany`)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

   **b) ZENDESK_EMAIL**
   - Key: `ZENDESK_EMAIL`
   - Value: `agent@yourcompany.com` (your Zendesk agent email)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

   **c) ZENDESK_API_TOKEN**
   - Key: `ZENDESK_API_TOKEN`
   - Value: Your Zendesk API token (see Step 4 below to generate)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

   **d) ZENDESK_JWT_SECRET**
   - Key: `ZENDESK_JWT_SECRET`
   - Value: The secret you generated in Step 1 (must match Zendesk!)
   - Environment: Select **Production**, **Preview**, and **Development**
   - Click **"Save"**

4. **Redeploy Your Application**
   - After adding all variables, go to **"Deployments"** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - This ensures the new environment variables are loaded

---

## Step 4: Generate Zendesk API Token

1. **Go to Zendesk Admin**
   - Navigate to: **Apps and integrations** → **APIs** → **Zendesk API**

2. **Enable Token Access**
   - Toggle **"Token Access"** to **ON**

3. **Create API Token**
   - Click **"Add API token"** button
   - Give it a description: `Vercel App Token`
   - Click **"Create"**
   - **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)
   - This is what you'll use for `ZENDESK_API_TOKEN` in Vercel

---

## Step 5: Test Your Setup

1. **Test the Public Preview:**
   ```
   https://zendesk-ticket-preview.vercel.app/ticket/12345
   ```
   Replace `12345` with an actual ticket ID from your Zendesk

2. **Test SSO Authentication:**
   - First, authenticate a user (for demo, use the `/zendesk/authenticate` endpoint)
   - Then click "View Full Ticket" button
   - You should be redirected to Zendesk with SSO

---

## Quick Checklist

- [ ] Generated secure JWT secret
- [ ] Configured Zendesk JWT SSO with Remote login URL: `https://zendesk-ticket-preview.vercel.app/zendesk/sso`
- [ ] Set Shared Secret in Zendesk (matches your generated secret)
- [ ] Added `ZENDESK_SUBDOMAIN` to Vercel
- [ ] Added `ZENDESK_EMAIL` to Vercel
- [ ] Generated Zendesk API token
- [ ] Added `ZENDESK_API_TOKEN` to Vercel
- [ ] Added `ZENDESK_JWT_SECRET` to Vercel (matches Zendesk)
- [ ] Redeployed application in Vercel
- [ ] Tested public ticket preview
- [ ] Tested SSO redirect

---

## Troubleshooting

### "Invalid JWT token" error
- Verify `ZENDESK_JWT_SECRET` in Vercel matches exactly with Zendesk Shared Secret
- Check for extra spaces or line breaks
- Ensure you redeployed after adding the variable

### "Ticket not found" error
- Verify `ZENDESK_SUBDOMAIN` is correct (no `https://` or `.zendesk.com`)
- Check that `ZENDESK_API_TOKEN` has read permissions
- Verify the ticket ID exists in your Zendesk

### SSO redirect not working
- Verify Remote login URL in Zendesk is: `https://zendesk-ticket-preview.vercel.app/zendesk/sso`
- Check that JWT SSO is enabled in Zendesk
- Ensure user is authenticated (has session cookie)

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs: **Deployments** → Click deployment → **"Logs"** tab
2. Verify all environment variables are set correctly
3. Ensure Zendesk JWT SSO is properly configured
4. Test with a simple ticket ID first
