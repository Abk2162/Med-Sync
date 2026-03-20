# 1. Build Next.js frontend
FROM node:18-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# 2. Setup Flask Backend
FROM python:3.10-slim

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy Next.js exported static files to backend/static
COPY --from=builder /app/frontend/out /app/frontend/out

# Copy Flask backend code
COPY backend/app.py backend/

# Set environment variables for production
ENV FLASK_APP=backend/app.py
ENV PORT=8080

EXPOSE 8080

# Run gunicorn, which targets the app inside backend.app module
# Note: we run from /app so the relative path to frontend/out in app.py remains consistent 
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "backend.app:app"]
