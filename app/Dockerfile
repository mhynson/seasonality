# Use the official Node.js 18 image.
FROM node:18-alpine AS builder

# Create and change to the app directory.
WORKDIR /app

# Install dependencies based on the preferred package manager.
COPY package.json yarn.lock ./
RUN yarn install

# Copy the rest of the application code.
COPY . .

# Build the application.
RUN yarn build

# Use the official Node.js 18 image as a base for the runtime environment.
FROM node:18-alpine AS runner

# Set working directory.
WORKDIR /app

# Copy the built application from the builder stage.
COPY --from=builder /app ./

# Install production dependencies.
RUN yarn install --production

# Expose port 3000
EXPOSE 3000

# Run the Next.js application.
CMD ["yarn", "start"]
