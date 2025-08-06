# Use official Node.js image for build
FROM node:20 AS build

WORKDIR /app
COPY . .

# Install dependencies and build Angular app
RUN npm install --legacy-peer-deps
RUN npm run build

# Use official nginx image for serving static files
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d

# Copy built Angular app to nginx html directory
COPY --from=build /app/dist/pocai/browser /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]