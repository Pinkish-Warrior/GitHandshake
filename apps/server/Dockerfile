# Use a lightweight Node.js image
FROM node:20-alpine AS development

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml from the monorepo root and the server app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json apps/server/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the NestJS application
RUN pnpm --filter server build

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["pnpm", "--filter", "server", "start:prod"]
