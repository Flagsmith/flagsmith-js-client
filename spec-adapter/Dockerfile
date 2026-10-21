# Builds the SDK from source with the adapter for the Flagsmith SDK behavioural spec.
# Build from the repository root: docker build -f spec-adapter/Dockerfile .
FROM node:24-slim AS build

WORKDIR /sdk
COPY package.json package-lock.json .npmrc ./
COPY patches ./patches
# Install scripts apply ./patches; husky skips itself without a git checkout.
RUN npm ci
COPY . .
# Pack lib/flagsmith, the package published as @flagsmith/flagsmith.
RUN npm run prebuild && npm run bundle && npm pack ./lib/flagsmith --ignore-scripts --pack-destination /tmp

FROM node:24-slim

WORKDIR /adapter
COPY --from=build /tmp/flagsmith-flagsmith-*.tgz /tmp/
RUN npm install --no-save --no-audit --no-fund /tmp/flagsmith-flagsmith-*.tgz && rm /tmp/*.tgz

COPY spec-adapter/adapter.mts ./

ENV PORT=8080
EXPOSE 8080
CMD ["node", "adapter.mts"]
