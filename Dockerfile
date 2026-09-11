# Multi-stage production build for DevOS

# Stage 1: Build Web & API
FROM node:20-alpine AS builder
WORKDIR /app

# Copy manifests
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/

# Install all dependencies
RUN npm ci

# Copy source trees
COPY apps/api/ ./apps/api/
COPY apps/web/ ./apps/web/

# Build both applications
RUN npm run build --workspace=@devos/api
RUN npm run build --workspace=@devos/web

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5001

# Copy built assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/apps/api/package*.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/web/dist ./apps/web/dist

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 5001

CMD ["node", "apps/api/dist/server.js"]
