/**
 * Adapter that lets the Flagsmith SDK behavioural spec drive this SDK.
 *
 * Protocol: https://github.com/Flagsmith/sdk-spec/blob/main/ADAPTER.md
 */

import { readFileSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';
import type { IFlagsmith, IInitConfig, ITraits } from '@flagsmith/flagsmith/types';

const SDK_PACKAGE = '@flagsmith/flagsmith';
const { version } = JSON.parse(
    readFileSync(new URL('./package.json', import.meta.resolve(SDK_PACKAGE)), 'utf8'),
);

type Client = { flagsmith: IFlagsmith; config: IInitConfig; initialised: boolean };

const clients = new Map<string, Client>();
let lastClientId = 0;

const CLIENT_ROUTE = /^\/clients\/(?<clientId>[^/]+)(?<action>\/[a-z-]+)?$/;

function serialiseFlags(flagsmith: IFlagsmith) {
    return {
        flags: Object.entries(flagsmith.getAllFlags()).map(([featureName, flag]) => ({
            featureName,
            enabled: flag.enabled,
            value: flag.value ?? null,
        })),
    };
}

// The protocol sends plain trait values; the SDK's evaluation context expects { value }.
function toTraits(traits: Record<string, unknown> = {}): ITraits {
    return Object.fromEntries(Object.entries(traits).map(([key, value]) => [key, { value }])) as ITraits;
}

function errorMessage(error: unknown): string {
    if (!(error instanceof Error)) {
        return String(error);
    }
    const message = `${error.name}: ${error.message}`;
    return error.cause ? `${message} (caused by ${errorMessage(error.cause)})` : message;
}

function send(res: ServerResponse, status: number, body?: unknown) {
    const payload = body === undefined ? '' : JSON.stringify(body);
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
    });
    res.end(payload);
}

async function readBody(req: IncomingMessage): Promise<any> {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    const raw = Buffer.concat(chunks).toString();
    return raw ? JSON.parse(raw) : {};
}

async function route(req: IncomingMessage, res: ServerResponse) {
    const { method, url: path } = req;

    if (method === 'GET' && path === '/health') {
        return send(res, 200, { sdk: 'flagsmith-js-client', version });
    }

    if (method === 'POST' && path === '/clients') {
        const body = await readBody(req);
        const clientId = String(++lastClientId);
        clients.set(clientId, {
            flagsmith: createFlagsmithInstance(),
            config: {
                api: body.apiUrl,
                fetch: globalThis.fetch,
                evaluationContext: { environment: { apiKey: body.environmentKey } },
            },
            initialised: false,
        });
        return send(res, 201, { clientId });
    }

    const match = CLIENT_ROUTE.exec(path ?? '');
    const client = match && clients.get(match.groups!.clientId);
    if (!match || !client) {
        return send(res, 404, { error: `No route for ${method} ${path}` });
    }
    const { clientId, action } = match.groups!;
    const { flagsmith, config } = client;

    if (method === 'DELETE' && action === undefined) {
        clients.delete(clientId);
        flagsmith.stopListening();
        return send(res, 204);
    }

    // A client-side SDK loads flags in init(), then reloads them on getFlags() or identify().
    if (method === 'POST' && action === '/environment-flags') {
        if (client.initialised) {
            await flagsmith.getFlags();
        } else {
            await flagsmith.init(config);
        }
        client.initialised = true;
        return send(res, 200, serialiseFlags(flagsmith));
    }

    if (method === 'POST' && action === '/identity-flags') {
        const body = await readBody(req);
        const traits = toTraits(body.traits);
        if (client.initialised) {
            await flagsmith.identify(body.identifier, traits);
        } else {
            await flagsmith.init({
                ...config,
                evaluationContext: {
                    ...config.evaluationContext,
                    identity: { identifier: body.identifier, traits },
                },
            });
        }
        client.initialised = true;
        return send(res, 200, serialiseFlags(flagsmith));
    }

    return send(res, 404, { error: `No route for ${method} ${path}` });
}

const server = createServer(async (req, res) => {
    try {
        await route(req, res);
    } catch (error) {
        // Report SDK errors to the runner.
        console.error(error);
        send(res, 500, { error: errorMessage(error) });
    }
    console.log(`adapter: ${req.method} ${req.url} ${res.statusCode}`);
});

const port = Number(process.env.PORT ?? 8080);
server.listen(port, () => console.log(`adapter: listening on :${port}`));
