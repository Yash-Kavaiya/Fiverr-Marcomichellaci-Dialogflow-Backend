# Use an official Node runtime as the base image
FROM node:21-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml tsconfig.json ./

# Install dependencies
RUN pnpm install

# Copy the entire project
COPY . .

# Build TypeScript to JavaScript
RUN pnpm build

# Copy static data to the dist folder
RUN mkdir -p dist/data && cp -r src/data/* dist/data/

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["pnpm", "start"]
