FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy entire backend directory
COPY . .

# Expose port
EXPOSE 5000

# Start server from the main entry point
CMD ["node", "src/server.js"]

