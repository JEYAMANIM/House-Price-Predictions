# Step 1: Build React Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend/frontend
COPY frontend/frontend/package*.json ./
RUN npm install
COPY frontend/frontend/ ./
RUN npm run build

# Step 2: Python Backend
FROM python:3.11-slim
WORKDIR /app

# Install Python requirements
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy source files & frontend build output
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/frontend/dist ./frontend/frontend/dist

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT}"]
