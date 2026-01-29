# Verification Flow for Dev Team Access

## Overview

This system allows dev team members to access Zendesk tickets after being verified by **support@telecrm.in**. Since support@telecrm.in is CC'd on all tickets but is not a Zendesk user, this verification system ensures only authorized dev team members can access tickets.

## How It Works

### 1. Dev Team Member Requests Access

1. Dev team member visits: `https://zendesk-ticket-preview.vercel.app/ticket/2405`
2. Clicks **"View Full Ticket"** button
3. Sees a form asking for their email address
4. Enters their email and clicks **"Request Access"**
5. System creates a verification request

### 2. Support@telecrm.in Verifies User

1. Support@telecrm.in receives a verification link (or checks admin panel)
2. Visits: `https://zendesk-ticket-preview.vercel.app/zendesk/admin`
3. Sees pending verification requests
4. Clicks **"Verify"** button next to the user's email
5. User is now verified and can access tickets

### 3. Verified User Accesses Ticket

1. Verified user visits ticket preview page
2. Clicks **"View Full Ticket"**
3. Enters their email (if not already in session)
4. System checks if user is verified
5. If verified, generates JWT token and redirects to Zendesk
6. Zendesk authenticates user and shows ticket

## Endpoints

### Request Access
- **POST** `/zendesk/request-access`
- Body: `{ email, return_to, ticket_id }`
- Creates a verification request

### Verify User (Support Only)
- **GET** `/zendesk/verify?token=TOKEN&verifier=support@telecrm.in`
- Verifies a user (only support@telecrm.in can verify)

### Admin Panel
- **GET** `/zendesk/admin`
- Shows pending verifications and verified users
- Support@telecrm.in can verify users from here

### SSO Endpoint
- **GET** `/zendesk/sso?return_to=/hc/en-us/requests/2405`
- Checks if user is verified
- If verified, generates JWT and redirects to Zendesk
- If not verified, shows access denied message

## Security Features

✅ **Verification Required**: Only verified users can access tickets  
✅ **Support Verification**: Only support@telecrm.in can verify users  
✅ **JWT SSO**: Secure authentication to Zendesk  
✅ **Zendesk Authorization**: Zendesk still enforces final access control  
✅ **Session Management**: Verified users stay verified (in-memory, use DB in production)

## Important Notes

### For Support@telecrm.in

1. **Admin Panel**: Visit `/zendesk/admin` to see all pending requests
2. **Verification Link**: Each request includes a direct verification link
3. **Verification is Permanent**: Once verified, users stay verified (until revoked)

### For Dev Team Members

1. **One-Time Verification**: Request access once, get verified, then access all tickets
2. **Email Must Match**: Use the same email address for all requests
3. **Already Verified?**: If already verified, you can sign in directly

### JWT SSO Configuration

If users are still being asked to sign in after verification:

1. **Check Zendesk JWT SSO Settings**:
   - Admin → Security → SSO → JWT SSO
   - Ensure it's enabled
   - Verify Shared Secret matches Vercel `ZENDESK_JWT_SECRET`

2. **Check Vercel Logs**:
   - Look for JWT generation errors
   - Verify the SSO URL is being built correctly

3. **Verify JWT Secret**:
   - Must match exactly between Zendesk and Vercel
   - No extra spaces or characters

## Production Recommendations

1. **Database Storage**: Replace in-memory storage with database
2. **Email Notifications**: Send emails to support@telecrm.in when access is requested
3. **Email Verification**: Add email verification for dev team members
4. **Admin Authentication**: Add authentication to admin panel
5. **Audit Logging**: Log all verification actions
6. **Token Expiration**: Add expiration to verification tokens
7. **Revoke Access**: Add ability to revoke user access

## Testing

### Test Verification Flow

1. Visit ticket preview: `/ticket/2405`
2. Click "View Full Ticket"
3. Enter dev team member email
4. Click "Request Access"
5. Copy verification link
6. Visit verification link as support@telecrm.in
7. User should now be verified
8. Try accessing ticket again - should work!

### Test JWT SSO

1. After verification, access ticket
2. Should redirect to Zendesk without asking for sign-in
3. If asked to sign in, check JWT SSO configuration
