# ==========================================
# Multi-stage Dockerfile for Owner Dashboard
# Optimized for Dokploy / Production Deployment
# ==========================================

# --- Tahap 1: Build Environment ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files untuk layer caching yang optimal
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy seluruh source code
COPY . .

# Build production bundle (hasil ke /app/dist)
RUN npm run build

# --- Tahap 2: Production Web Server (Nginx) ---
FROM nginx:alpine AS runner

# Hapus default website Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build dari stage builder ke root direktori Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom konfigurasi Nginx untuk SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 untuk Dokploy / reverse proxy Traefik
EXPOSE 80

# Healthcheck untuk memastikan Nginx berjalan dengan baik
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]
