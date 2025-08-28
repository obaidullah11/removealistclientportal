# Deployment Guide for RemoveList Frontend

## Environment Setup

### Development Environment
1. Create a `.env.development` file in the root directory:
```bash
REACT_APP_API_BASE_URL=http://localhost:8000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_SOCIAL_LOGIN=false
REACT_APP_ENABLE_NOTIFICATIONS=true
```

### Production Environment
1. Create a `.env.production` file in the root directory:
```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_ENVIRONMENT=production
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_SOCIAL_LOGIN=true
REACT_APP_ENABLE_NOTIFICATIONS=true
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
REACT_APP_GA_TRACKING_ID=your_ga_tracking_id
```

## Build Commands

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Deployment Options

### 1. Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables in Netlify dashboard
5. Enable automatic deployments

### 2. Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts
4. Add environment variables in Vercel dashboard

### 3. AWS S3 + CloudFront
1. Build the project: `npm run build`
2. Upload build folder to S3 bucket
3. Configure S3 for static website hosting
4. Set up CloudFront distribution
5. Configure custom domain (optional)

### 4. Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | Yes | `http://localhost:8000/api` |
| `REACT_APP_ENVIRONMENT` | Environment name | No | `development` |
| `REACT_APP_ENABLE_ANALYTICS` | Enable Google Analytics | No | `false` |
| `REACT_APP_ENABLE_SOCIAL_LOGIN` | Enable social login | No | `false` |
| `REACT_APP_ENABLE_NOTIFICATIONS` | Enable notifications | No | `true` |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `REACT_APP_FACEBOOK_APP_ID` | Facebook app ID | No | - |
| `REACT_APP_GA_TRACKING_ID` | Google Analytics ID | No | - |
| `REACT_APP_SENTRY_DSN` | Sentry error tracking DSN | No | - |

## Pre-deployment Checklist

- [ ] Update API_BASE_URL to production backend
- [ ] Set up environment variables
- [ ] Test all authentication flows
- [ ] Verify form validations work
- [ ] Check toast notifications display correctly
- [ ] Test responsive design on mobile devices
- [ ] Verify all routes work correctly
- [ ] Test error handling scenarios
- [ ] Check console for errors/warnings
- [ ] Optimize images and assets
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (Google Analytics)
- [ ] Set up monitoring and alerts

## Performance Optimization

### Code Splitting
The app uses React Router for automatic code splitting by routes.

### Bundle Analysis
```bash
npm run build
npx serve -s build
```

### Optimization Tips
1. Use React.memo for expensive components
2. Implement lazy loading for images
3. Use service workers for caching
4. Optimize images (WebP format)
5. Enable gzip compression
6. Use CDN for static assets

## Security Considerations

1. **Environment Variables**: Never expose sensitive data in client-side code
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure proper CORS settings on backend
4. **Content Security Policy**: Implement CSP headers
5. **Token Security**: Tokens are stored in localStorage (consider httpOnly cookies for enhanced security)

## Monitoring and Analytics

### Error Tracking with Sentry
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
});
```

### Google Analytics
```javascript
import ReactGA from 'react-ga4';

if (process.env.REACT_APP_GA_TRACKING_ID) {
  ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
}
```

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check REACT_APP_API_BASE_URL
   - Verify backend is running
   - Check CORS configuration

2. **Build Fails**
   - Clear node_modules and reinstall
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Authentication Issues**
   - Check token storage
   - Verify API endpoints
   - Check network requests in DevTools

4. **Routing Issues**
   - Verify React Router configuration
   - Check for conflicting routes
   - Ensure proper basename for subdirectory deployments


