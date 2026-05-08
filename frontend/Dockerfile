# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# ✅ set npm mirror
RUN npm config set registry https://mirror2.chabokan.net/npm/

# Install deps
RUN npm ci

COPY . .

# Build frontend
RUN npm run build

# ---------- Runtime stage ----------
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

# ✅ set mirror
RUN npm config set registry https://mirror2.chabokan.net/npm/

# Copy installed modules
COPY --from=builder /app/node_modules ./node_modules

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

# Start frontend server
CMD ["npm", "run", "start"]
