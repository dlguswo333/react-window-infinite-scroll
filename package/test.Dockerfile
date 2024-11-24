# Dockerfile to run test
# Run this Dockerfile at the monorepo root.
FROM mcr.microsoft.com/playwright:v1.44.1-jammy

WORKDIR /app

# Copy package.json files for caching and that is not expected to change frequently.
COPY ./package.json ./package-lock.json .

RUN npm ci

COPY . .

RUN npm run build
RUN npm test
