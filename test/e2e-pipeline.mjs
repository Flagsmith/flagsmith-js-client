/**
 * E2E test: JS client -> pipeline server -> MinIO (parquet)
 *
 * Prerequisites:
 *   - Pipeline server running on localhost:8080
 *   - MinIO running on localhost:9000 (console on 9001)
 *
 * Usage:
 *   node test/e2e-pipeline.mjs
 */

import flagsmith from '../lib/flagsmith/index.mjs';

const runId = Math.random().toString(36).slice(2, 8);
const ENVIRONMENT_KEY = `e2e_test_${runId}`;
const PIPELINE_URL = 'http://localhost:8080/';
const identity = `user_${runId}`;

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBool = () => Math.random() > 0.5;
const randomString = () => Math.random().toString(36).slice(2, 10);

const defaultFlags = {
    hero: { enabled: randomBool(), value: randomString() },
    font_size: { enabled: true, value: randomInt(8, 48) },
    beta_feature: { enabled: randomBool(), value: null },
    theme: { enabled: true, value: randomBool() ? 'dark' : 'light' },
};

await flagsmith.init({
    environmentID: ENVIRONMENT_KEY,
    identity,
    traits: { plan: 'pro', score: randomInt(1, 100) },
    evaluationAnalyticsConfig: {
        analyticsServerUrl: PIPELINE_URL,
        flushInterval: 3000,
    },
    defaultFlags,
    preventFetch: true,
    fetch: globalThis.fetch,
});

console.log(`Run ID: ${runId}`);
console.log(`Environment: ${ENVIRONMENT_KEY}`);
console.log(`Identity: ${identity}`);
console.log(`Default flags:`, JSON.stringify(defaultFlags, null, 2));
console.log('\nEvaluating flags...');

console.log('  hero value:', flagsmith.getValue('hero'));
console.log('  font_size value:', flagsmith.getValue('font_size'));
console.log('  hero enabled:', flagsmith.hasFeature('hero'));
console.log('  beta_feature enabled:', flagsmith.hasFeature('beta_feature'));
console.log('  theme value:', flagsmith.getValue('theme'));

console.log(`\nWaiting for flush (3s)...`);

await new Promise((resolve) => setTimeout(resolve, 4000));

console.log('Done. Check:');
console.log('  - Pipeline server logs for ingested events');
console.log('  - MinIO console at http://localhost:9001 for parquet files');
console.log('  - Or run: docker exec minio mc ls local/flagsmith-analytics/ --recursive');

process.exit(0);
