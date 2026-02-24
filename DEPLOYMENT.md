# Deployment Guide

## Local Development

### Prerequisites
- Node.js v14+
- MongoDB local instance
- Git

### Quick Start
```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev

# Terminal 2 - Frontend
cd frontend
npx http-server . -p 8000
```

Access at `http://localhost:8000`

## Production Deployment

### Backend Deployment (Cloud)

#### Option 1: Heroku
```bash
# Install Heroku CLI
heroku login
heroku create smart-attendance-backend

# Configure environment variables
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/smart_attendance"
heroku config:set JWT_SECRET="your_secure_key"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

#### Option 2: AWS EC2
```bash
# SSH into instance
ssh -i key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone <your-repo>
cd smart-attendance/backend

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name "smart-attendance"
pm2 startup
pm2 save

# Configure Nginx reverse proxy
sudo apt-get install nginx
```

#### Option 3: Docker
```dockerfile
# Dockerfile
FROM node:16
WORKDIR /app
COPY backend/ .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t smart-attendance-backend .
docker run -p 5000:5000 -e MONGODB_URI=mongodb://... smart-attendance-backend
```

### Database Deployment

#### MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/smart_attendance
   ```

#### Azure Cosmos DB
```bash
az cosmosdb create --name smart-attendance --kind MongoDB
```

### Frontend Deployment

#### Option 1: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=.
```

#### Option 3: GitHub Pages
```bash
# Build static site
cd frontend

# Push to gh-pages branch
git subtree push --prefix frontend origin gh-pages
```

#### Option 4: AWS S3 + CloudFront
```bash
# Create S3 bucket
aws s3 mb s3://smart-attendance-frontend

# Upload files
aws s3 sync frontend/ s3://smart-attendance-frontend --delete

# Create CloudFront distribution (via AWS Console)
```

#### Option 5: Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

## Environment Configuration

### Production Backend (.env)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/smart_attendance
PORT=5000
JWT_SECRET=your_super_secure_random_key_min_32_chars
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=error
```

### Frontend Configuration

Update `js/api.js`:
```javascript
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

## SSL/TLS Certificates

### Let's Encrypt (Free)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com
sudo certbot renew --dry-run
```

### AWS Certificate Manager
1. Use AWS ACM for free SSL certificates
2. Attach to CloudFront or ALB

## Performance Optimization

1. **Database Indexing:**
```javascript
// MongoDB indexes
db.students.createIndex({ email: 1 })
db.students.createIndex({ rollNumber: 1 })
db.attendance.createIndex({ student: 1, date: 1 })
```

2. **Caching:**
- Use Redis for session caching
- CloudFlare for CDN

3. **Compression:**
```javascript
// In server.js
const compression = require('compression');
app.use(compression());
```

4. **Load Balancing:**
- Nginx reverse proxy
- AWS ALB
- HAProxy

## Monitoring & Logging

### Application Monitoring
```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 logs smart-attendance
```

### Error Tracking
- Sentry integration
- LogRocket
- DataDog

### Health Checks
```bash
curl https://yourdomain.com/api/health
```

## Backup & Recovery

### Database Backups
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://..." --out=/backup

# Restore
mongorestore --uri="mongodb+srv://..." /backup
```

### Automated Backups (MongoDB Atlas)
- Enable automatic daily backups in MongoDB Atlas console
- Configure backup retention (7-90 days)

## Security Checklist

- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] JWT secrets changed
- [ ] Database credentials rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] DDoS protection enabled

## Troubleshooting Deployment

### Issue: Database Connection Timeout
```bash
# Check MongoDB connection string
# Verify network access in MongoDB Atlas
# Check firewall rules
```

### Issue: CORS Errors
```javascript
// Update CORS in backend
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### Issue: 502 Bad Gateway
- Check backend server logs
- Verify process is running
- Check port configuration
- Review reverse proxy settings

### Issue: Memory Leaks
```bash
pm2 monitor  # Check memory usage
pm2 reload smart-attendance  # Graceful restart
```

## Scaling Strategies

1. **Horizontal Scaling:**
   - Load balancer (Nginx/AWS ALB)
   - Multiple backend instances
   - Sticky sessions for user state

2. **Vertical Scaling:**
   - Increase server resources
   - Upgrade database tier

3. **Database Optimization:**
   - Connection pooling
   - Query optimization
   - Caching layer (Redis)

4. **Content Delivery:**
   - CDN for frontend assets
   - Lazy loading for face models

## Continuous Deployment

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        run: ./deploy.sh
```

### Deploy Script
```bash
#!/bin/bash
cd /app/smart-attendance
git pull
npm install
npm test
pm2 restart smart-attendance
```

## Support

For deployment issues:
1. Check logs: `pm2 logs`
2. Monitor resources: `pm2 monit`
3. Review error messages carefully
4. Check documentation links in code
5. Contact support with logs attached
