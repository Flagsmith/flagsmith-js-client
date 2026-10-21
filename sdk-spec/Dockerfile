# Runs this SDK, built from source, under the Flagsmith SDK behavioural spec.
# docker build -f sdk-spec/Dockerfile --build-context harness=<sdk-spec>/harness/nodejs .
FROM docker.io/library/node:24-slim AS build

WORKDIR /sdk
COPY package.json package-lock.json .npmrc ./
COPY patches ./patches
# Install scripts apply ./patches; husky skips itself without a git checkout.
RUN npm ci
COPY . .
# Pack lib/flagsmith, the package published as @flagsmith/flagsmith.
RUN npm run prebuild && npm run bundle && npm pack ./lib/flagsmith --ignore-scripts --pack-destination /tmp

FROM docker.io/library/node:24-slim

WORKDIR /sdk
COPY --from=build /tmp/flagsmith-flagsmith-*.tgz /tmp/
RUN npm install --no-save --no-audit --no-fund /tmp/flagsmith-flagsmith-*.tgz && rm /tmp/*.tgz

COPY --from=harness harness.mts /harness/harness.mts
COPY sdk-spec/steps.mts ./sdk-spec/steps.mts

ENTRYPOINT ["node", "/harness/harness.mts", "sdk-spec/steps.mts"]
