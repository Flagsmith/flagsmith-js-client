// Adapter that lets the Flagsmith SDK behavioural spec drive this SDK.
//
// Protocol: https://github.com/Flagsmith/sdk-spec/blob/main/ADAPTER.md
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createFlagsmithInstance } from '../lib/flagsmith/isomorphic.mjs';

const { version } = JSON.parse(readFileSync(new URL('../lib/flagsmith/package.json', import.meta.url)));

// clientId -> { flagsmith, config, initialised }
const clients = new Map();
let nextClientId = 1;

const CLIENT_ROUTE = /^\/clients\/(?<clientId>[^/]+)(?<action>\/[a-z-]+)?$/;

function serialiseFlags(flagsmith) {
    return {
        flags: Object.entries(flagsmith.getAllFlags()).map(([featureName, flag]) => ({
            featureName,
            enabled: flag.enabled,
            value: flag.value ?? null,
        })),
    };
}

// The protocol sends plain trait values; the SDK's evaluation context expects { value }.
function toTraits(traits = {}) {
    return Object.fromEntries(Object.entries(traits).map(([key, value]) => [key, { value }]));
}

async function readBody(request) {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    const text = Buffer.concat(chunks).toString();
    return text ? JSON.parse(text) : {};
}

async function route(request) {
    const { method, url } = request;

    if (method === 'GET' && url === '/health') {
        return [200, { sdk: 'flagsmith-js-client', version }];
    }

    if (method === 'POST' && url === '/clients') {
        const body = await readBody(request);
        const clientId = String(nextClientId++);
        clients.set(clientId, {
            flagsmith: createFlagsmithInstance(),
            config: {
                api: body.apiUrl,
                fetch: globalThis.fetch,
                evaluationContext: { environment: { apiKey: body.environmentKey } },
            },
            initialised: false,
        });
        return [201, { clientId }];
    }

    const match = CLIENT_ROUTE.exec(url);
    const client = match && clients.get(match.groups.clientId);
    if (!client) return [404, { error: `No route for ${method} ${url}` }];
    const { clientId, action } = match.groups;
    const { flagsmith, config } = client;

    if (method === 'DELETE' && !action) {
        flagsmith.stopListening?.();
        clients.delete(clientId);
        return [204];
    }

    // A client-side SDK loads flags in init(), then reloads them whenever the identity changes.
    if (method === 'POST' && action === '/environment-flags') {
        if (client.initialised) await flagsmith.getFlags();
        else await flagsmith.init(config);
        client.initialised = true;
        return [200, serialiseFlags(flagsmith)];
    }

    if (method === 'POST' && action === '/identity-flags') {
        const { identifier, traits } = await readBody(request);
        if (client.initialised) {
            await flagsmith.identify(identifier, toTraits(traits));
        } else {
            await flagsmith.init({
                ...config,
                evaluationContext: {
                    ...config.evaluationContext,
                    identity: { identifier, traits: toTraits(traits) },
                },
            });
        }
        client.initialised = true;
        return [200, serialiseFlags(flagsmith)];
    }

    return [404, { error: `No route for ${method} ${url}` }];
}

const server = createServer(async (request, response) => {
    let status, body;
    try {
        [status, body] = await route(request);
    } catch (error) {
        // Report SDK errors to the runner
        console.error(error);
        [status, body] = [500, { error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) }];
    }
    console.log(`adapter: ${request.method} ${request.url} ${status}`);
    const payload = body === undefined ? '' : JSON.stringify(body);
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
    });
    response.end(payload);
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '0.0.0.0', () => console.log(`adapter: listening on :${port}`));
