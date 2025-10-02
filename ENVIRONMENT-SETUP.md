# 🔐 Environment Setup Guide

## Quick Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   cp .env.example apps/desktop/.env.local
   ```

2. **Add your API keys:**
   - Get your OpenAI API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Choose a secure admin password
   - Edit both `.env.local` files with your actual values

3. **Start the app:**
   ```bash
   pnpm install
   pnpm dev:desktop
   ```

## 🔑 Required Environment Variables

### `.env.local` (Root directory)
```bash
OPENAI_API_KEY=<your-actual-key-here>
ADMIN_PASSWORD=<your-secure-password>
```

### `apps/desktop/.env.local` (Desktop app)
```bash
VITE_OPENAI_API_KEY=<your-actual-key-here>
VITE_ADMIN_PASSWORD=<your-secure-password>
VITE_ADMIN_MODE_ENABLED=true
VITE_DAILY_REQUEST_LIMIT=100
VITE_PER_USER_SESSION_LIMIT=20
```

## 🚨 Security Important Notes

- ✅ **Never commit `.env.local` files** - they contain your secrets
- ✅ **Use strong passwords** - avoid common patterns
- ✅ **Set OpenAI usage limits** in your OpenAI dashboard to control costs
- ✅ **Regenerate API keys** if you suspect they've been compromised

## 🎯 Getting Your OpenAI API Key

1. Visit [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)
5. **Set usage limits** in your OpenAI dashboard

## 🔧 Troubleshooting

### "Missing environment variables" Error
- Check that `.env.local` files exist in both root and `apps/desktop/`
- Ensure variables don't have placeholder values
- Restart the development server after changing environment files

### API Key Not Working
- Verify the key is correct (starts with `sk-`)
- Check your OpenAI account for usage limits
- Ensure you have credits/billing set up in OpenAI

### Admin Login Issues
- Check that `VITE_ADMIN_PASSWORD` matches what you're entering
- Admin password is case-sensitive

## 🏗️ How It Works

1. **Environment files** (`.env.local`) store your secrets locally
2. **Git ignores** these files so secrets never get committed
3. **TypeScript validation** ensures required variables are set
4. **Runtime checks** provide helpful error messages if misconfigured

Your API keys are now secure! 🔒