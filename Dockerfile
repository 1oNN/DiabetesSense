# Multi-stage build for production-ready container

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/diabetes-predictor
COPY diabetes-predictor/package*.json ./
RUN npm ci --only=production
COPY diabetes-predictor .
RUN npm run build

# Stage 2: Python backend with frontend static files
FROM python:3.9-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY app ./app
COPY run.py .
COPY scaler.joblib .

# Copy frontend build artifacts to serve static files
COPY --from=frontend-build /app/diabetes-predictor/build ./static

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run with gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "60", "run:app"]
