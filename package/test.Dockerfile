# Dockerfile to run test
FROM mcr.microsoft.com/playwright:v1.38.0-jammy

WORKDIR /app

# Copy package.json for caching and that is not expected to change frequently.
COPY ./package.json .

RUN npm install

COPY . .

RUN npm test
