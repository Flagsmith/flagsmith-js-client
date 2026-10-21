/**
 * Steps for the Flagsmith SDK behavioural spec: https://github.com/Flagsmith/sdk-spec
 *
 * Each function implements the step in the comment above it.
 */

import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';
import type { IFlagsmith, IInitConfig, ITraits } from '@flagsmith/flagsmith/types';

// A client-side SDK holds one identity's flags: it loads them in init(), then reloads them
// as the identity changes. The client remembers whether init() has run.
type Client = { flagsmith: IFlagsmith; config: IInitConfig; initialised: boolean };

function asSpecFlags(flagsmith: IFlagsmith) {
    return Object.entries(flagsmith.getAllFlags()).map(([feature, flag]) => ({
        feature,
        enabled: flag.enabled,
        value: flag.value,
    }));
}

// Runs init() with `config` on the client's first load, and `reload` on every later one.
async function load(client: Client, config: IInitConfig, reload: () => Promise<void>) {
    if (client.initialised) {
        await reload();
    } else {
        await client.flagsmith.init(config);
        client.initialised = true;
    }
    return asSpecFlags(client.flagsmith);
}

// Create the SDK client
export function createClient(environmentKey: string, apiUrl: string): Client {
    return {
        flagsmith: createFlagsmithInstance(),
        config: { api: apiUrl, evaluationContext: { environment: { apiKey: environmentKey } } },
        initialised: false,
    };
}

// When the application gets the environment flags
export function getEnvironmentFlags(client: Client) {
    const { flagsmith } = client;
    // getFlags() fetches the identity's flags while one is set; logout() drops it first.
    return load(client, client.config, () =>
        flagsmith.getContext().identity ? flagsmith.logout() : flagsmith.getFlags(),
    );
}

// When the application gets the flags for identity "{identifier}" with traits:
export function getIdentityFlags(client: Client, identifier: string, traits: ITraits) {
    const config = {
        ...client.config,
        evaluationContext: { ...client.config.evaluationContext, identity: { identifier, traits } },
    };
    return load(client, config, () => client.flagsmith.identify(identifier, traits));
}
