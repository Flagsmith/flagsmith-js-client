/**
 * Steps for the Flagsmith SDK behavioural spec: https://github.com/Flagsmith/sdk-spec
 *
 * Each function implements the Gherkin step in the comment above it.
 */

import { createFlagsmithInstance } from '@flagsmith/flagsmith/isomorphic';
import type { IFlagsmith, IFlagsmithValue, IInitConfig, ITraits } from '@flagsmith/flagsmith/types';

// A client-side SDK holds one identity's flags: it loads them in init(), then reloads them
// with getFlags() or identify(). The client remembers whether init() has run.
type Client = { flagsmith: IFlagsmith; config: IInitConfig; initialised: boolean };

function asSpecFlags(flagsmith: IFlagsmith) {
    return Object.entries(flagsmith.getAllFlags()).map(([feature, flag]) => ({
        feature,
        enabled: flag.enabled,
        value: flag.value,
    }));
}

// Given an SDK client for the environment
export function createClient(environmentKey: string, apiUrl: string): Client {
    return {
        flagsmith: createFlagsmithInstance(),
        config: { api: apiUrl, evaluationContext: { environment: { apiKey: environmentKey } } },
        initialised: false,
    };
}

// When the application gets the environment flags
export async function getEnvironmentFlags(client: Client) {
    if (client.initialised) {
        await client.flagsmith.getFlags();
    } else {
        await client.flagsmith.init(client.config);
        client.initialised = true;
    }
    return asSpecFlags(client.flagsmith);
}

// When the application gets the flags for identity "{identifier}" with traits:
export async function getIdentityFlags(
    client: Client,
    identifier: string,
    traits: Record<string, IFlagsmithValue>,
) {
    const identityTraits = Object.fromEntries(
        Object.entries(traits).map(([key, value]) => [key, { value }]),
    ) as ITraits;
    if (client.initialised) {
        await client.flagsmith.identify(identifier, identityTraits);
    } else {
        await client.flagsmith.init({
            ...client.config,
            evaluationContext: {
                ...client.config.evaluationContext,
                identity: { identifier, traits: identityTraits },
            },
        });
        client.initialised = true;
    }
    return asSpecFlags(client.flagsmith);
}
