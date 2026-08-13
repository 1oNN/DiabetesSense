# Production Deployment Guide

This guide covers deploying the Diabetes Risk Predictor application to production using Docker and various cloud platforms.

## Docker Deployment (Recommended)

### Quick Start

Build and run with a single command:

```bash
# Build the image
docker build -t diabetes-predictor:latest .

# Run the container
docker run -p 5000:5000 \
  -e FLASK_ENV=production \
  -e FLASK_DEBUG=False \
  diabetes-predictor:latest
```

Access the app at `http://localhost:5000`

### Docker Compose (Single Command Deployment)

**Production:**
```bash
docker-compose up -d
```

**Development with hot reload:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Container Details

- **Base Image**: `python:3.9-slim` (optimized for size and security)
- **Frontend**: Built using multi-stage build from Node 18-alpine
- **Workers**: 4 Gunicorn workers (adjust via environment variable)
- **Health Check**: Automatic container health monitoring
- **Port**: 5000

## Cloud Platform Deployments

### Heroku

**Prerequisites:**
```bash
npm install -g heroku
heroku login
```

**Deploy:**
```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set FLASK_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

**Cost**: Free tier available (with limitations)

### AWS Elastic Container Service (ECS)

**Prerequisites:**
- AWS account
- AWS CLI configured
- ECR repository created

**Steps:**
```bash
# Build and push image to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker build -t diabetes-predictor .
docker tag diabetes-predictor:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/diabetes-predictor:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/diabetes-predictor:latest

# Create ECS task definition and service
# (Use AWS Console or CloudFormation)
```

### Google Cloud Run

**Prerequisites:**
- Google Cloud account
- gcloud CLI installed

**Deploy:**
```bash
# Set your project
gcloud config set project YOUR_PROJECT_ID

# Build and deploy
gcloud run deploy diabetes-predictor \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s
```

**Cost**: Pay per use, first 180k requests/month free

### DigitalOcean App Platform

**Via Web Console:**
1. Connect GitHub repo
2. Select `Dockerfile` as source
3. Set environment variables
4. Deploy

**Via CLI:**
```bash
doctl apps create --spec app.yaml
```

### Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name diabetes-predictor \
  --image myregistry.azurecr.io/diabetes-predictor:latest \
  --ports 5000 \
  --environment-variables FLASK_ENV=production
```

## Security Best Practices

### Environment Variables

Use a `.env.production` file (never commit to repo):

```env
FLASK_ENV=production
FLASK_DEBUG=False
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://yourdomain.com
```

### Container Security

```bash
# Run as non-root user
FROM python:3.9-slim
RUN useradd -m appuser
USER appuser

# Scan image for vulnerabilities
docker scan diabetes-predictor:latest

# Use specific versions (not latest)
FROM python:3.9.15-slim
```

### Network Security

- Use HTTPS/TLS in production
- Configure CORS properly
- Set security headers via nginx
- Use Web Application Firewall (WAF) if available

## Scaling Configuration

### Gunicorn Workers

Adjust based on CPU cores:

```bash
docker run -e GUNICORN_WORKERS=8 diabetes-predictor:latest
```

Or in `docker-compose.yml`:

```yaml
services:
  web:
    build: .
    environment:
      - GUNICORN_WORKERS=8
    command: >
      gunicorn
      --bind 0.0.0.0:5000
      --workers 8
      --worker-class sync
      --max-requests 1000
      --timeout 60
      run:app
```

### Load Balancing

Use nginx as reverse proxy (included as `nginx.conf`):

```bash
docker run -p 80:80 -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf nginx:alpine
```

Or with docker-compose:

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - web
```

## Monitoring & Logging

### Health Checks

Endpoint: `GET /health`

```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true
}
```

### Docker Health Checks

Built-in automatic health checks every 30 seconds.

### Logging

```bash
# View logs
docker logs <container-id>

# Follow logs
docker logs -f <container-id>

# Configure log driver
docker run --log-driver json-file --log-opt max-size=10m diabetes-predictor:latest
```

### Application Monitoring

Consider integrating:
- **Datadog** - APM and infrastructure monitoring
- **New Relic** - Application performance monitoring
- **Sentry** - Error tracking
- **Prometheus** - Metrics collection

## Performance Optimization

### Image Size Optimization

Current: ~500MB (with React build included)

To reduce:
```bash
# Multi-stage build (already done)
# Remove dev dependencies
pip install --no-cache-dir
npm ci --only=production
```

### Prediction Latency

- Model inference: 10-50ms
- Network roundtrip: 50-100ms
- Total response: 100-200ms

### Database Performance

If adding database later:
- Use connection pooling (SQLAlchemy)
- Add caching (Redis)
- Index frequently queried fields

## Testing in Production

### Smoke Tests

```bash
#!/bin/bash
# Test health endpoint
curl -f http://localhost:5000/health || exit 1

# Test prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "HighBP": 1, "HighChol": 1, "CholCheck": 1, "BMI": 32,
    "Smoker": 0, "Stroke": 0, "HeartDiseaseorAttack": 0,
    "PhysActivity": 1, "Fruits": 1, "Veggies": 1,
    "HvyAlcoholConsump": 0, "AnyHealthcare": 1, "NoDocbcCost": 0,
    "GenHlth": 4, "MentHlth": 0, "PhysHlth": 0, "DiffWalk": 0,
    "Sex": 0, "Age": 55, "Education": 4, "Income": 8
  }' || exit 1

echo "✓ Health checks passed"
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker logs <container-id>

# Check if port is in use
lsof -i :5000

# Run with interactive shell
docker run -it --entrypoint /bin/bash diabetes-predictor:latest
```

### Model files missing

```
Error: Model files not loaded
```

**Solution**: Ensure files exist before building:
```bash
ls -la app/model/random_forest_model_upsampled.joblib
ls -la scaler.joblib
```

### High latency

1. Check CPU/memory usage: `docker stats`
2. Increase workers: `--workers 8`
3. Optimize nginx caching
4. Consider CDN for static assets

### Out of memory

```bash
# Increase memory limit
docker run -m 1g diabetes-predictor:latest

# Or in docker-compose.yml
services:
  web:
    deploy:
      resources:
        limits:
          memory: 1G
```

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] CORS origins restricted
- [ ] HTTPS/TLS enabled
- [ ] Health check endpoint working
- [ ] All dependencies in requirements.txt
- [ ] Models and scaler files included
- [ ] Frontend build artifacts present
- [ ] No debug mode in production
- [ ] Logging configured
- [ ] Backup strategy in place
- [ ] Monitoring/alerting set up

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build and push Docker image
        run: |
          docker build -t diabetes-predictor:latest .
          # Push to registry and deploy
```

## Getting Help

- Docker documentation: https://docs.docker.com/
- Heroku documentation: https://devcenter.heroku.com/
- AWS ECS: https://docs.aws.amazon.com/ecs/
- Check logs: `docker logs -f <container-id>`

---

**Last Updated**: 2026-04-21
