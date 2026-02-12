# Use a lightweight Node.js image
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml from the monorepo root and the client app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json apps/client/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js application
RUN pnpm --filter client build

# --- Production Stage ---
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate

# Copy necessary files from the builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/client/.next ./apps/client/.next
COPY --from=builder /usr/src/app/apps/client/public ./apps/client/public
COPY --from=builder /usr/src/app/apps/client/package.json ./apps/client/package.json
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /usr/src/app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Set environment variables for Next.js
ENV NODE_ENV production
# Set the port Next.js will listen on
ENV PORT 3000

EXPOSE 3000

# Start the application
CMD ["pnpm", "--filter", "client", "start"]
