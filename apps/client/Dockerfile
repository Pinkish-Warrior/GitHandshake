# Use a lightweight Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json from the monorepo root and the client app
COPY package*.json ./
COPY apps/client/package*.json apps/client/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build --workspace=client

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Copy necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/client/.next ./apps/client/.next
COPY --from=builder /usr/src/app/apps/client/public ./apps/client/public
COPY --from=builder /usr/src/app/apps/client/package.json ./apps/client/package.json
COPY --from=builder /usr/src/app/package.json ./package.json

# Set environment variables for Next.js
ENV NODE_ENV production
# Set the port Next.js will listen on
ENV PORT 3000

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start", "--workspace=client"]
