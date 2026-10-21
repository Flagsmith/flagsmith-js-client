# Builds the SDK from source with the adapter for the Flagsmith SDK behavioural spec.
# Build from the repository root: docker build -f spec-adapter/Dockerfile .
FROM node:24-slim

WORKDIR /sdk
COPY package.json package-lock.json .npmrc ./
COPY patches ./patches
# Install scripts: patch-package applies ./patches; husky skips itself without a git checkout.
RUN npm ci

COPY . .
RUN npm run prebuild && npm run bundle

ENV PORT=8080
EXPOSE 8080
CMD ["node", "spec-adapter/adapter.mjs"]
