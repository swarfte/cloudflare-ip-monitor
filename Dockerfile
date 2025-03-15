# Use official Node.js 22 slim image
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY npm-shrinkwrap.json* ./

# Install dependencies (including devDependencies)
RUN npm install --production=false

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Remove devDependencies after build
RUN npm prune --production

# Create non-root user
RUN useradd -m nodeuser

# Set ownership and switch to non-root user
RUN chown -R nodeuser:nodeuser /app
USER nodeuser

ENV PORT=8123

# Expose the Nuxt preview port
EXPOSE 8123

# Start the preview server
CMD ["npm", "run", "preview"]