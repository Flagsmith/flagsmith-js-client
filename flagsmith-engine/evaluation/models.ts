// This file is the entry point for the evaluation module types
// All types from evaluations should be at least imported here and re-exported
// Do not use types directly from generated files

import type {
    EvaluationResult as EvaluationContextResult,
    FlagResult,
    FeatureMetadata,
    SegmentMetadata
} from './evaluationResult/evaluationResult.types.js';

import type {
    FeatureContext,
    EnvironmentContext,
    IdentityContext,
    SegmentContext
} from './evaluationContext/evaluationContext.types.js';

export * from './evaluationContext/evaluationContext.types.js';

export enum SegmentSource {
    API = 'api',
    IDENTITY_OVERRIDE = 'identity_override'
}

// Feature types
export interface SDKFeatureMetadata extends FeatureMetadata {
    id: number;
}

export interface FeatureContextWithMetadata<T extends FeatureMetadata = FeatureMetadata>
    extends FeatureContext {
    metadata: T;
    [k: string]: unknown;
}

export type FeaturesWithMetadata<T extends FeatureMetadata = FeatureMetadata> = {
    [k: string]: FeatureContextWithMetadata<T>;
};

export type FlagResultWithMetadata<T extends FeatureMetadata = FeatureMetadata> = FlagResult & {
    metadata: T;
};

export type EvaluationResultFlags<T extends FeatureMetadata = FeatureMetadata> = Record<
    string,
    FlagResultWithMetadata<T>
>;

// Segment types
export interface SDKSegmentMetadata extends SegmentMetadata {
    id?: number;
    source?: SegmentSource;
}

export interface SegmentContextWithMetadata<T extends SegmentMetadata = SegmentMetadata>
    extends SegmentContext {
    metadata: T;
    overrides?: FeatureContextWithMetadata<FeatureMetadata>[];
}

export type SegmentsWithMetadata<T extends SegmentMetadata = SegmentMetadata> = {
    [k: string]: SegmentContextWithMetadata<T>;
};

export interface SegmentResultWithMetadata {
    name: string;
    metadata: SDKSegmentMetadata;
}

export type EvaluationResultSegments = SegmentResultWithMetadata[];

// Evaluation context types
export interface GenericEvaluationContext<
    T extends FeatureMetadata = FeatureMetadata,
    S extends SegmentMetadata = SegmentMetadata
> {
    environment: EnvironmentContext;
    identity?: IdentityContext | null;
    segments?: SegmentsWithMetadata<S>;
    features?: FeaturesWithMetadata<T>;
    [k: string]: unknown;
}

export type EvaluationContextWithMetadata = GenericEvaluationContext<
    SDKFeatureMetadata,
    SDKSegmentMetadata
>;

// Evaluation result types
export type EvaluationResult<T extends FeatureMetadata = FeatureMetadata> = {
    flags: EvaluationResultFlags<T>;
    segments: EvaluationResultSegments;
};

export type EvaluationResultWithMetadata = EvaluationResult<SDKFeatureMetadata>;
