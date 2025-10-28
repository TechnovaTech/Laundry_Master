# Git Push Instructions

## To push to TechnovaTech/Laundry-main repository:

1. **Get Personal Access Token:**
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Copy the token

2. **Update remote URL with token:**
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/TechnovaTech/Laundry-main.git
   ```

3. **Push to repository:**
   ```bash
   git push -u origin master
   ```

## Current Status:
- ✅ Repository initialized
- ✅ All files committed
- ❌ Need authentication to push

Replace `YOUR_TOKEN` with your actual GitHub Personal Access Token.