# Step 1: Build React Client
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Set the server URL to your VPS domain
ENV REACT_APP_SERVER_URL=https://daoductam.dpdns.org
RUN npm run build

# Step 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
