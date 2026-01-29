# CC User Access to Tickets

## Can CC'd Users View Tickets?

**Yes!** Users who are CC'd on a ticket can view it in Zendesk through this application.

## How It Works

### 1. User Flow
1. User visits the public ticket preview: `/ticket/2405`
2. Clicks "View Full Ticket" button
3. Enters their **email address** (must match their Zendesk account email)
4. Gets authenticated via JWT SSO
5. Redirected to Zendesk Help Center
6. **Zendesk enforces authorization** and shows the ticket if the user has access

### 2. Zendesk Authorization Rules

Zendesk will show a ticket to a user if they meet **any** of these conditions:

- ✅ **Requester**: User who created the ticket
- ✅ **CC'd User**: User who is CC'd on the ticket
- ✅ **Agent/Admin**: User with agent or admin role who has access
- ✅ **Organization Member**: User in the same organization as the ticket

### 3. Important Requirements

For CC'd users to access tickets:

1. **Email Must Match Zendesk Account**
   - The email they enter must be the same email in their Zendesk account
   - If they don't have a Zendesk account, they need to create one first

2. **Zendesk Account Must Exist**
   - The user must have a Zendesk account (end-user, agent, or admin)
   - If they're CC'd but don't have an account, they should create one

3. **Zendesk Settings**
   - Ensure your Zendesk is configured to allow CC'd users to view tickets
   - Check: **Admin** → **Settings** → **Tickets** → **CC and followers**

## Testing CC User Access

### Step 1: Add a User to CC
1. Open a ticket in Zendesk
2. Add a user's email to the CC field
3. Save the ticket

### Step 2: Test Access
1. Visit: `https://zendesk-ticket-preview.vercel.app/ticket/[TICKET_ID]`
2. Click "View Full Ticket"
3. Enter the CC'd user's email address
4. They should be redirected to Zendesk and see the ticket

## Zendesk Configuration

### Enable CC Access (if not already enabled)

1. Go to **Admin** → **Settings** → **Tickets**
2. Under **"CC and followers"**, ensure:
   - ✅ "CC'd users can view tickets" is enabled
   - ✅ "Followers can view tickets" is enabled (if using followers)

### User Account Requirements

- **End Users**: Can view tickets they're CC'd on (if enabled in settings)
- **Agents**: Can view tickets they have access to
- **Admins**: Can view all tickets

## Security Notes

- ✅ **Zendesk enforces final authorization** - users only see tickets they're allowed to see
- ✅ **JWT SSO is secure** - tokens are short-lived and unique
- ✅ **No public access** - users must authenticate
- ✅ **Email validation** - users must use their actual Zendesk account email

## Troubleshooting

### "User not found" or "Cannot access ticket"
- Verify the email matches the Zendesk account email exactly
- Ensure the user has a Zendesk account
- Check that CC access is enabled in Zendesk settings
- Verify the user is actually CC'd on the ticket

### "Ticket not visible after SSO"
- Check Zendesk settings for CC user access
- Verify the user's Zendesk account status (active, suspended, etc.)
- Ensure the ticket hasn't been deleted or restricted

## Example Scenario

**Ticket #2405:**
- Requester: `customer@example.com`
- CC'd: `manager@example.com`, `support@example.com`

**Who can view:**
- ✅ `customer@example.com` (requester)
- ✅ `manager@example.com` (CC'd)
- ✅ `support@example.com` (CC'd)
- ✅ Any agent/admin with access to the ticket's organization

**Who cannot view:**
- ❌ `other@example.com` (not requester, not CC'd, no access)
