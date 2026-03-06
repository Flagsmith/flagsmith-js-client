import {
    EvaluationContextWithMetadata,
    EvaluationResultSegments,
    EvaluationResultWithMetadata,
    FeatureContextWithMetadata,
    SDKFeatureMetadata,
    FlagResultWithMetadata,
    GenericEvaluationContext
} from './evaluation/models.js';
import { getIdentitySegments } from './segments/evaluators.js';
import { EvaluationResultFlags } from './evaluation/models.js';
import { TARGETING_REASONS } from './features/types.js';
import { getHashedPercentageForObjIds } from './utils/hashing/index.js';
export { EnvironmentModel } from './environments/models.js';
export { IdentityModel } from './identities/models.js';
export { TraitModel } from './identities/traits/models.js';
export { SegmentModel } from './segments/models.js';
export { FeatureModel, FeatureStateModel } from './features/models.js';
export { OrganisationModel } from './organisations/models.js';

type SegmentOverride = {
    feature: FeatureContextWithMetadata<SDKFeatureMetadata>;
    segmentName: string;
};

export type SegmentOverrides = Record<string, SegmentOverride>;

/**
 * Evaluates flags and segments for the given context.
 *
 * This is the main entry point for the evaluation engine. It processes segments,
 * applies feature overrides based on segment priority, and returns the final flag states with
 * evaluation reasons.
 *
 * @param context - EvaluationContext containing environment, identity, and segment data
 * @returns EvaluationResult with flags, segments, and original context
 */
export function getEvaluationResult(
    context: EvaluationContextWithMetadata
): EvaluationResultWithMetadata {
    const enrichedContext = getEnrichedContext(context);
    const { segments, segmentOverrides } = evaluateSegments(enrichedContext);
    const flags = evaluateFeatures(enrichedContext, segmentOverrides);

    return { flags, segments };
}

function getEnrichedContext(context: EvaluationContextWithMetadata): EvaluationContextWithMetadata {
    const identityKey = getIdentityKey(context);
    if (!identityKey) return context;

    return {
        ...context,
        ...(context.identity && {
            identity: {
                identifier: context.identity.identifier,
                key: identityKey,
                traits: context.identity.traits || {}
            }
        })
    };
}

/**
 * Evaluates which segments the identity belongs to and collects feature overrides.
 *
 * @param context - EvaluationContext containing identity and segment definitions
 * @returns Object containing segments the identity belongs to and any feature overrides
 */
export function evaluateSegments(context: EvaluationContextWithMetadata): {
    segments: EvaluationResultSegments;
    segmentOverrides: Record<string, SegmentOverride>;
} {
    if (!context.identity || !context.segments) {
        return {
            segments: [],
            segmentOverrides: {} as Record<string, SegmentOverride>
        };
    }
    const identitySegments = getIdentitySegments(context);

    const segments = identitySegments.map(segment => ({
        name: segment.name,
        ...(segment.metadata
            ? {
                  metadata: {
                      ...segment.metadata
                  }
              }
            : {})
    })) as EvaluationResultSegments;
    const segmentOverrides = processSegmentOverrides(identitySegments);

    return { segments, segmentOverrides };
}

/**
 * Processes feature overrides from segments, applying priority rules.
 *
 * When multiple segments override the same feature, the segment with
 * higher priority (lower numeric value) takes precedence.
 *
 * @param identitySegments - Segments that the identity belongs to
 * @returns Map of feature keys to their highest-priority segment overrides
 */
export function processSegmentOverrides(identitySegments: any[]): Record<string, SegmentOverride> {
    const segmentOverrides: Record<string, SegmentOverride> = {};

    for (const segment of identitySegments) {
        if (!segment.overrides) continue;

        const overridesList = Array.isArray(segment.overrides) ? segment.overrides : [];

        for (const override of overridesList) {
            if (shouldApplyOverride(override, segmentOverrides)) {
                segmentOverrides[override.name] = {
                    feature: override,
                    segmentName: segment.name
                };
            }
        }
    }

    return segmentOverrides;
}

/**
 * Evaluates all features in the context, applying segment overrides where applicable.
 * For each feature:
 * - Checks if a segment override exists
 * - Uses override values if present, otherwise evaluates the base feature
 * - Determines appropriate evaluation reason
 * - Handles multivariate evaluation for features without overrides
 *
 * @param context - EvaluationContext containing features and identity
 * @param segmentOverrides - Map of feature keys to their segment overrides
 * @returns EvaluationResultFlags containing evaluated flag results
 */
export function evaluateFeatures(
    context: EvaluationContextWithMetadata,
    segmentOverrides: Record<string, SegmentOverride>
): EvaluationResultFlags<SDKFeatureMetadata> {
    const flags: EvaluationResultFlags<SDKFeatureMetadata> = {};

    for (const feature of Object.values(context.features || {})) {
        const segmentOverride = segmentOverrides[feature.name];
        const finalFeature = segmentOverride ? segmentOverride.feature : feature;

        const { value: evaluatedValue, reason: evaluatedReason } = evaluateFeatureValue(
            finalFeature,
            getIdentityKey(context)
        );

        flags[finalFeature.name] = {
            name: finalFeature.name,
            enabled: finalFeature.enabled,
            value: evaluatedValue,
            ...(finalFeature.metadata ? { metadata: finalFeature.metadata } : {}),
            reason:
                evaluatedReason ??
                getTargetingMatchReason({ type: 'SEGMENT', override: segmentOverride })
        } as FlagResultWithMetadata<SDKFeatureMetadata>;
    }

    return flags;
}

function evaluateFeatureValue(
    feature: FeatureContextWithMetadata,
    identityKey?: string
): { value: any; reason?: string } {
    if (!!feature.variants && feature.variants.length > 0 && !!identityKey) {
        return getMultivariateFeatureValue(feature, identityKey);
    }

    return { value: feature.value, reason: undefined };
}

/**
 * Evaluates a multivariate feature flag to determine which variant value to return for a given identity.
 *
 * Uses deterministic hashing to ensure the same identity always receives the same variant,
 * while distributing variants according to their configured weight percentages.
 *
 * @param feature - The feature context containing variants and their weights
 * @param identityKey - The identity key used for deterministic variant selection
 * @returns The variant value if the identity falls within a variant's range, otherwise the default feature value
 */
function getMultivariateFeatureValue(
    feature: FeatureContextWithMetadata,
    identityKey?: string
): { value: any; reason?: string } {
    const percentageValue = getHashedPercentageForObjIds([feature.key, identityKey]);
    const sortedVariants = [...(feature?.variants || [])].sort((a, b) => {
        return (a.priority ?? Infinity) - (b.priority ?? Infinity);
    });

    let startPercentage = 0;
    for (const variant of sortedVariants) {
        const limit = startPercentage + variant.weight;
        if (startPercentage <= percentageValue && percentageValue < limit) {
            return {
                value: variant.value,
                reason: getTargetingMatchReason({ type: 'SPLIT', weight: variant.weight })
            };
        }
        startPercentage = limit;
    }

    return { value: feature.value, reason: undefined };
}

export function shouldApplyOverride(
    override: any,
    existingOverrides: Record<string, SegmentOverride>
): boolean {
    const currentOverride = existingOverrides[override.name];
    return (
        !currentOverride || isHigherPriority(override.priority, currentOverride.feature.priority)
    );
}

export function isHigherPriority(
    priorityA: number | undefined,
    priorityB: number | undefined
): boolean {
    return (priorityA ?? Infinity) < (priorityB ?? Infinity);
}

export type TargetingMatchReason =
    | {
          type: 'SEGMENT';
          override: SegmentOverride;
      }
    | {
          type: 'SPLIT';
          weight: number;
      };

const getTargetingMatchReason = (matchObject: TargetingMatchReason) => {
    const { type } = matchObject;

    if (type === 'SEGMENT') {
        return matchObject.override
            ? `${TARGETING_REASONS.TARGETING_MATCH}; segment=${matchObject.override.segmentName}`
            : TARGETING_REASONS.DEFAULT;
    }

    if (type === 'SPLIT') {
        return `${TARGETING_REASONS.SPLIT}; weight=${matchObject.weight}`;
    }

    return TARGETING_REASONS.DEFAULT;
};

const getIdentityKey = (context: GenericEvaluationContext): string | undefined => {
    if (!context.identity) return undefined;
    return context.identity.key || `${context.environment.key}_${context.identity?.identifier}`;
};
