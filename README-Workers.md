# IC Studios Bot - Cloudflare Workers Deployment

This guide shows you how to deploy your IC Studios chatbot to Cloudflare Workers for significant cost savings and better performance.

## 🚀 Benefits of Cloudflare Workers

- **Cost-effective**: Free tier includes 100,000 requests/day
- **Global performance**: Runs on Cloudflare's edge network worldwide
- **Serverless**: No infrastructure management needed
- **Auto-scaling**: Handles traffic spikes automatically
- **Fast cold starts**: Near-instant response times

## 📋 Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://dash.cloudflare.com/sign-up)
2. **Node.js**: Install [Node.js 16+](https://nodejs.org/)
3. **Google API Key**: Your existing Gemini API key

## 🛠️ Deployment Steps

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Login to Cloudflare

```bash
wrangler login
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Edit `wrangler.toml` and add your API key:

```toml
[env.production.vars]
GOOGLE_API_KEY = "your-actual-google-api-key-here"
```

**Alternative (Recommended)**: Set secrets via CLI for better security:

```bash
wrangler secret put GOOGLE_API_KEY
# Enter your API key when prompted
```

### 5. Deploy to Workers

```bash
# Deploy to production
wrangler deploy

# Or deploy to development first
wrangler dev --remote
```

### 6. Test Your Deployment

After deployment, Wrangler will provide you with a URL like:
```
https://ic-studios-bot.your-subdomain.workers.dev
```

Visit this URL to test your chatbot!

## 🔧 Configuration Options

### Custom Domain (Optional)

To use your own domain:

1. Add your domain to Cloudflare
2. In Wrangler config:

```toml
[env.production.routes]
pattern = "chat.yourdomain.com/*"
zone_name = "yourdomain.com"
```

### CORS Configuration

Update CORS origins in `wrangler.toml`:

```toml
[env.production.vars]
ALLOWED_ORIGINS = "https://yourdomain.com,https://www.yourdomain.com"
```

### Session Storage (Optional)

If you need persistent session storage, uncomment the KV namespace in `wrangler.toml`:

```bash
# Create KV namespace
wrangler kv:namespace create "SESSIONS"

# Add the ID to wrangler.toml
[[env.production.kv_namespaces]]
binding = "SESSIONS"
id = "your-kv-namespace-id"
```

## 💰 Cost Comparison

| Feature | Current Hosting | Cloudflare Workers |
|---------|----------------|-------------------|
| **Compute** | $5-20/month | Free (100K requests/day) |
| **Bandwidth** | $5-10/month | Free (unlimited) |
| **SSL/CDN** | $5-15/month | Free (built-in) |
| **Scaling** | Manual | Automatic |
| **Uptime** | 99.9% | 99.99%+ |
| **Global Edge** | Single region | 200+ locations |

**Total Savings**: $15-45/month → **$0/month** (for most use cases)

## 📊 Monitoring & Analytics

Monitor your deployment:

```bash
# View logs
wrangler tail

# Check analytics
wrangler dev --remote
```

Cloudflare Dashboard provides detailed analytics:
- Request count
- Response times
- Error rates
- Geographic distribution

## 🔄 Migration from Current Setup

To migrate from your current Flask deployment:

1. **Test Workers deployment** alongside current setup
2. **Update DNS** to point to Workers URL
3. **Decommission** old Flask hosting
4. **Monitor** performance and costs

## 🛡️ Security Best Practices

1. **Use secrets for API keys**:
   ```bash
   wrangler secret put GOOGLE_API_KEY
   ```

2. **Restrict CORS origins**:
   ```toml
   ALLOWED_ORIGINS = "https://yourdomain.com"
   ```

3. **Rate limiting** (if needed):
   ```javascript
   // Add to worker if abuse detected
   if (requestCount > 100) {
     return new Response('Rate limited', { status: 429 });
   }
   ```

## 🚨 Troubleshooting

### Common Issues

**1. Module import errors**
```bash
# Ensure correct import syntax
import { GoogleGenerativeAI } from '@google/generative-ai';
```

**2. Environment variables not working**
```bash
# Use secrets instead of vars for sensitive data
wrangler secret put GOOGLE_API_KEY
```

**3. CORS errors**
```bash
# Check ALLOWED_ORIGINS in wrangler.toml
```

### Debug Commands

```bash
# Local development
wrangler dev

# View logs
wrangler tail

# Check configuration
wrangler whoami
```

## 📈 Next Steps

After successful deployment:

1. **Monitor usage** in Cloudflare Dashboard
2. **Set up custom domain** if needed
3. **Configure rate limiting** if experiencing abuse
4. **Add analytics tracking** for user insights
5. **Consider upgrading** to Workers Paid plan if exceeding free limits

## 🎯 Performance Optimizations

The Workers version includes several optimizations:

- **Reduced bundle size**: No Flask overhead
- **Edge caching**: Static assets served from edge
- **Connection pooling**: Reused connections to Google API
- **Efficient serialization**: Optimized JSON handling

Your bot should now respond **50-200ms faster** globally!

---

**Questions?** Check the [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) or open an issue. 