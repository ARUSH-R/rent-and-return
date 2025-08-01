# 🚀 Production Deployment Guide

This guide will help you deploy the Rent and Return application to production.

## 📋 Prerequisites

- [Railway](https://railway.app/) account (for backend)
- [Vercel](https://vercel.com/) account (for frontend)
- [Supabase](https://supabase.com/) account (for database)
- [Stripe](https://stripe.com/) account (for payments)

## 🗄️ Database Setup (Supabase)

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your database URL and credentials

2. **Get connection details**
   - Go to Settings → Database
   - Copy the connection string and credentials

## 🔧 Backend Deployment (Railway)

1. **Connect your GitHub repository**
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Select the `backend` directory

2. **Set environment variables**
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://your-supabase-url:5432/postgres
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=your-supabase-password
   JWT_SECRET=your-very-long-and-secure-jwt-secret-minimum-32-characters
   JWT_EXPIRATION=86400000
   STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   MAIL_FROM=no-reply@rentreturn.com
   ```

3. **Deploy**
   - Railway will automatically build and deploy your backend
   - Note the generated URL (e.g., `https://your-app.railway.app`)

## 🎨 Frontend Deployment (Vercel)

1. **Connect your GitHub repository**
   - Go to [vercel.com](https://vercel.com)
   - Create a new project
   - Connect your GitHub repository
   - Select the `frontend` directory

2. **Set environment variables**
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
   ```

3. **Deploy**
   - Vercel will automatically build and deploy your frontend
   - Note the generated URL (e.g., `https://your-app.vercel.app`)

## 🔐 Security Checklist

- [ ] JWT secret is at least 32 characters long
- [ ] All environment variables are set
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Database credentials are secure
- [ ] Stripe keys are production keys

## 🧪 Testing Your Deployment

1. **Health Check**
   ```
   GET https://your-backend-url.railway.app/actuator/health
   ```

2. **Test Registration**
   - Go to your frontend URL
   - Try registering a new user
   - Check if the user appears in your database

3. **Test Login**
   - Try logging in with the registered user
   - Verify JWT token is generated

4. **Test Products**
   - Browse products
   - Verify images load correctly

## 📊 Monitoring

1. **Railway Dashboard**
   - Monitor backend logs
   - Check resource usage
   - Set up alerts

2. **Vercel Dashboard**
   - Monitor frontend performance
   - Check deployment status
   - View analytics

3. **Supabase Dashboard**
   - Monitor database performance
   - Check query logs
   - Set up backups

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:
- Push to `main` branch triggers deployment
- Preview deployments for pull requests
- Rollback to previous versions if needed

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase credentials
   - Verify network connectivity
   - Check firewall settings

2. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` includes your frontend URL
   - Check browser console for specific errors

3. **JWT Token Issues**
   - Verify `JWT_SECRET` is set correctly
   - Check token expiration settings

4. **Stripe Payment Issues**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Test with Stripe test mode first

### Support

- Check application logs in Railway/Vercel dashboards
- Monitor Supabase logs for database issues
- Use browser developer tools for frontend debugging

## 📈 Performance Optimization

1. **Database**
   - Add indexes for frequently queried columns
   - Monitor slow queries
   - Optimize connection pooling

2. **Backend**
   - Enable response caching
   - Optimize JPA queries
   - Monitor memory usage

3. **Frontend**
   - Enable code splitting
   - Optimize images
   - Use CDN for static assets

---

**🎉 Congratulations! Your Rent and Return application is now deployed to production!** 