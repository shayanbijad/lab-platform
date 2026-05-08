# ---------- Build stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Prevent prisma auto download during install
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1

COPY package*.json ./
COPY prisma ./prisma

# Install deps once
RUN npm ci

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build NestJS
RUN npm run build



# ---------- Runtime stage ----------
FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

# Copy installed modules instead of reinstalling
COPY --from=builder /app/node_modules ./node_modules

# Remove dev dependencies
RUN npm prune --omit=dev

# Copy build output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
