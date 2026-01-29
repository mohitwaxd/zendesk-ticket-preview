# Deployment Instructions

## Create GitHub Repository and Push

### Option 1: Using GitHub Website (Recommended)

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `zendesk-ticket-preview` (or your preferred name)
   - Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Push your code:**
   Run these commands in your terminal:

   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/zendesk-ticket-preview.git
   git branch -M main
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

### Option 2: Using GitHub CLI (After Authentication)

1. **Authenticate with GitHub CLI:**
   ```bash
   gh auth login
   ```
   Follow the prompts to authenticate.

2. **Create and push repository:**
   ```bash
   gh repo create zendesk-ticket-preview --public --source=. --remote=origin --push
   ```

### After Pushing to GitHub

Once your code is on GitHub, you can deploy to Vercel:

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy!
