# Dockerfile to run test
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

WORKDIR /app

# Copy package.json for caching and that is not expected to change frequently.
COPY ./package.json .

RUN npm install

COPY . .

RUN npm test
