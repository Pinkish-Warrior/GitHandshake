# Use a lightweight Node.js image
FROM node:20-alpine AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the monorepo root and the server app
# This is crucial for monorepo dependency management
COPY package*.json ./
COPY apps/server/package*.json apps/server/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the NestJS application
RUN npm run build --workspace=server

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start:prod", "--workspace=server"]
