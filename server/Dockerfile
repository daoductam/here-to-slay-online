# Step 1: Build TypeScript source code
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production image
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 4000
ENV PORT=4000
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
