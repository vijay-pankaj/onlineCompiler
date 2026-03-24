# Build stage
FROM node:20 AS build

WORKDIR /app

# Copy package.json first
COPY package*.json ./

# Copy .env for React build
COPY .env ./

RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
