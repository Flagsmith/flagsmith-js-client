/**
 * Mappers for converting API environment document to engine evaluation context.
 * These utilities bridge the gap between the Flagsmith API format and the evaluation engine format.
 */

import { buildEnvironmentModel } from '../flagsmith-engine/environments/util';
import { getEvaluationContext } from '../flagsmith-engine/evaluation/evaluationContext/mappers';
import { buildIdentityModel } from '../flagsmith-engine/identities/util';
import { TraitModel } from '../flagsmith-engine/identities/traits/models';
import type { EvaluationContextWithMetadata } from '../flagsmith-engine/evaluation/models';
import type { ClientEvaluationContext } from '../types';

/**
 * Converts an API environment document JSON to an evaluation context
 * suitable for the engine's getEvaluationResult function.
 *
 * @param environmentDocumentJSON - The raw JSON from the /environment-document/ endpoint
 * @param clientContext - The client's evaluation context (identity, traits, etc.)
 * @returns Evaluation context ready for the engine
 */
export function buildEvaluationContextFromDocument(
    environmentDocumentJSON: any,
    clientContext?: ClientEvaluationContext
): EvaluationContextWithMetadata {
    // Build the environment model using the engine's builder
    const environmentModel = buildEnvironmentModel(environmentDocumentJSON);

    // Build identity model if client has identity context
    let identityModel = undefined;
    let overrideTraits: TraitModel[] | undefined = undefined;

    if (clientContext?.identity?.identifier) {
        // Map client traits to engine TraitModel format
        const traits: TraitModel[] = [];
        if (clientContext.identity.traits) {
            for (const [key, traitContext] of Object.entries(clientContext.identity.traits)) {
                // Handle different trait context types
                const value = typeof traitContext === 'object' && traitContext !== null && 'value' in traitContext
                    ? traitContext.value
                    : traitContext;

                traits.push(
                    new TraitModel(
                        key,
                        value as any
                    )
                );
            }
        }

        // Build identity model
        // Note: We use empty arrays for identityFeatures since those come from the environment
        identityModel = buildIdentityModel({
            identifier: clientContext.identity.identifier,
            identity_uuid: clientContext.identity.identifier, // Use identifier as UUID for now
            created_date: new Date().toISOString(),
            environment_api_key: environmentModel.apiKey,
            identity_traits: traits,
            identity_features: []
        });

        overrideTraits = traits;
    }

    // Use the engine's mapper to convert to evaluation context
    const evaluationContext = getEvaluationContext(
        environmentModel,
        identityModel,
        overrideTraits
    );

    return evaluationContext as EvaluationContextWithMetadata;
}

/**
 * Converts engine evaluation result flags to SDK flags format.
 *
 * @param engineFlags - Flags from the engine's evaluation result
 * @returns SDK-formatted flags
 */
export function mapEngineResultToSDKFlags(engineFlags: any): Record<string, any> {
    const sdkFlags: Record<string, any> = {};

    for (const [name, flagResult] of Object.entries(engineFlags as Record<string, any>)) {
        sdkFlags[name.toLowerCase().replace(/ /g, '_')] = {
            id: flagResult.metadata?.id || 0,
            enabled: flagResult.enabled || false,
            value: flagResult.value
        };
    }

    return sdkFlags;
}
