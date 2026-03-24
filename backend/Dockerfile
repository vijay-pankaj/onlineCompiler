# Use latest stable node
FROM node:20

# Install docker client
RUN apt-get update && apt-get install -y docker.io

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "server.js"]
