# How to Run & Deploy Diabetes Risk Predictor

This guide covers local development setup and multiple deployment options including AWS.

---

## Table of Contents

1. [Local Development](#local-development)
2. [Production Build](#production-build)
3. [AWS Deployment](#aws-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Local Development

### Prerequisites

- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 14+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

### Backend Setup

1. **Clone the repository** (if not already cloned)
   ```bash
   git clone <repository-url>
   cd diabetes_app
   ```

2. **Create Python virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate    # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Prepare ML model files**
   - Ensure `scaler.joblib` exists in the root directory
   - Ensure `app/model/random_forest_model_upsampled.joblib` exists
   - If missing, you need to train the model or obtain it from the model directory

5. **Run Flask backend**
   ```bash
   python run.py
   ```
   - Backend will start at `http://localhost:5000`
   - API available at `http://localhost:5000/predict`

### Frontend Setup

1. **Open new terminal** and navigate to frontend directory
   ```bash
   cd diabetes-predictor
   ```

2. **Create `.env` file** in `diabetes-predictor/`
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Start React development server**
   ```bash
   npm start
   ```
   - Frontend will open at `http://localhost:3000`
   - Hot-reloading enabled for development

### Test the Application

1. Navigate to `http://localhost:3000`
2. Fill in health information in the prediction form
3. Click "Predict" to get diabetes risk assessment
4. View personalized recommendations

---

## Production Build

### Build Frontend for Production

```bash
cd diabetes-predictor
npm run build
```

- Creates optimized build in `diabetes-predictor/build/`
- Minified and optimized for performance

### Prepare Backend for Production

1. **Update environment variables**
   ```bash
   export FLASK_ENV=production
   export FLASK_DEBUG=0
   ```

2. **Test with production server**
   ```bash
   gunicorn run:app
   ```
   - Runs on `http://localhost:8000`
   - Suitable for production

---

## AWS Deployment

### Option 1: AWS Elastic Beanstalk (Recommended)

**Best for:** Full-stack applications with minimal DevOps

#### Step 1: Install EB CLI
```bash
pip install awsebcli
```

#### Step 2: Initialize Elastic Beanstalk
```bash
eb init -p python-3.11 diabetes-app --region us-east-1
```

#### Step 3: Create Environment
```bash
eb create diabetes-app-env
```

#### Step 4: Deploy
```bash
# Build frontend
cd diabetes-predictor
npm run build
cd ..

# Deploy to Elastic Beanstalk
eb deploy
```

#### Step 5: Configure Frontend
- Update `REACT_APP_BACKEND_URL` in `diabetes-predictor/.env`:
  ```
  REACT_APP_BACKEND_URL=http://diabetes-app-env.elasticbeanstalk.com
  ```

#### Step 6: Redeploy with Updated Config
```bash
cd diabetes-predictor
npm run build
cd ..
eb deploy
```

---

### Option 2: AWS EC2 + Nginx

**Best for:** More control and scalability

#### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2
2. Launch Ubuntu 20.04 LTS instance (t2.micro eligible for free tier)
3. Create security group allowing ports 22, 80, 443, 3000, 5000

#### Step 2: SSH into Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### Step 3: Install Dependencies
```bash
sudo apt update
sudo apt install python3-pip python3-venv nodejs npm nginx -y
```

#### Step 4: Clone Repository
```bash
git clone <repository-url>
cd diabetes_app
```

#### Step 5: Setup Python Backend
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Step 6: Build Frontend
```bash
cd diabetes-predictor
npm install
npm run build
cd ..
```

#### Step 7: Configure Nginx
Create `/etc/nginx/sites-available/diabetes-app`:
```nginx
upstream flask_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /home/ubuntu/diabetes_app/diabetes-predictor/build;
        try_files $uri /index.html;
    }

    location /predict {
        proxy_pass http://flask_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/diabetes-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 8: Run Flask Backend (Use Systemd)
Create `/etc/systemd/system/diabetes-api.service`:
```ini
[Unit]
Description=Diabetes Predictor API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/diabetes_app
Environment="PATH=/home/ubuntu/diabetes_app/venv/bin"
ExecStart=/home/ubuntu/diabetes_app/venv/bin/gunicorn run:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable diabetes-api
sudo systemctl start diabetes-api
```

---

### Option 3: AWS Lambda + API Gateway (Serverless)

**Best for:** Low-traffic, cost-conscious applications

#### Step 1: Install SAM CLI
```bash
pip install aws-sam-cli
```

#### Step 2: Initialize SAM Project
```bash
sam init --runtime python3.11
```

#### Step 3: Update template.yaml
Add Flask app configuration and API Gateway integration

#### Step 4: Build and Deploy
```bash
sam build
sam deploy --guided
```

#### Step 5: Deploy Frontend to S3 + CloudFront
```bash
# Build frontend
cd diabetes-predictor
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name

# Create CloudFront distribution
# (Use AWS Console or CLI)
```

---

### Option 4: AWS RDS + ECS (Production-Grade)

**Best for:** High-traffic, scalable applications with database

This requires:
- Docker containerization
- RDS database setup
- ECS cluster configuration
- Load balancing

**Contact** for advanced setup assistance.

---

## AWS Environment Variables

Set environment variables in AWS Console or CLI:

```bash
# For Elastic Beanstalk
eb setenv \
  FLASK_ENV=production \
  FLASK_DEBUG=0
```

For other services (EC2, Lambda):
- Set in `.env` file
- Or use AWS Secrets Manager
- Or set as environment variables in the service configuration

---

## AWS Model File Management

### Option A: Include in Deployment
- Keep `app/model/random_forest_model_upsampled.joblib` and `scaler.joblib` in repository
- Deploy with application code

### Option B: Use S3
1. Upload model files to S3:
   ```bash
   aws s3 cp app/model/random_forest_model_upsampled.joblib s3://your-bucket/models/
   aws s3 cp scaler.joblib s3://your-bucket/models/
   ```

2. Update `app/routes.py` to load from S3:
   ```python
   import boto3
   s3 = boto3.client('s3')
   model_obj = s3.get_object(Bucket='your-bucket', Key='models/random_forest_model_upsampled.joblib')
   random_forest_model = joblib.load(model_obj['Body'])
   ```

---

## Troubleshooting

### Backend Issues

**Error: "ModuleNotFoundError: No module named 'flask'"**
- Solution: Activate virtual environment and install requirements
  ```bash
  source venv/bin/activate
  pip install -r requirements.txt
  ```

**Error: "Model files not loaded"**
- Solution: Ensure model files exist at correct paths
  ```bash
  ls -la scaler.joblib
  ls -la app/model/random_forest_model_upsampled.joblib
  ```

**Error: CORS issues when calling API**
- Solution: Already handled in `app/__init__.py` with Flask-CORS
- Check if backend URL in frontend `.env` is correct

### Frontend Issues

**Error: "Cannot GET /predict"**
- Solution: This is a routing issue - make sure React Router is working
- The /predict route is a **backend API endpoint**, not a frontend route

**Error: "REACT_APP_BACKEND_URL is undefined"**
- Solution: Create `.env` file in `diabetes-predictor/` directory
  ```
  REACT_APP_BACKEND_URL=http://localhost:5000
  ```

**Frontend shows blank page**
- Solution: Check browser console for errors (F12)
- Clear cache: `npm start` (dev mode) or rebuild

### AWS Deployment Issues

**Elastic Beanstalk: Environment failed to create**
- Check AWS CloudFormation events for detailed errors
- Verify instance type and region configuration

**EC2: 502 Bad Gateway**
- Verify Flask backend is running: `systemctl status diabetes-api`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

**API timeout on Lambda**
- Increase timeout in template.yaml
- Check CloudWatch logs for errors

---

## Performance Optimization

### Frontend
- Built with Create React App optimization enabled
- CSS minified in production build

### Backend
- Use Gunicorn with multiple workers:
  ```bash
  gunicorn -w 4 -b 0.0.0.0:8000 run:app
  ```
- Consider caching model predictions if needed
- Monitor with AWS CloudWatch

### Database (if added)
- Use RDS with auto-scaling
- Enable read replicas for high traffic

---

## Monitoring & Logging

### AWS CloudWatch
```bash
# View Elastic Beanstalk logs
eb logs

# Stream logs in real-time
eb logs --stream
```

### Local Development
- Flask debug mode enabled by default
- Check terminal for request logs
- Browser DevTools (F12) for frontend debugging

---

## Next Steps

1. **Add database** - Store predictions and user data
2. **Add authentication** - Secure user accounts
3. **Add analytics** - Track prediction trends
4. **Mobile app** - React Native version
5. **API documentation** - Swagger/OpenAPI

---

## Support

For detailed AWS documentation:
- [Elastic Beanstalk Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
- [EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [Lambda Docs](https://docs.aws.amazon.com/lambda/)
