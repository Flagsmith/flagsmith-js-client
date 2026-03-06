import * as semver from 'semver';

import {
    FeatureModel,
    FeatureStateModel,
    MultivariateFeatureOptionModel,
    MultivariateFeatureStateValueModel
} from '../features/models.js';
import { getCastingFunction as getCastingFunction } from '../utils/index.js';
import {
    ALL_RULE,
    ANY_RULE,
    NONE_RULE,
    NOT_CONTAINS,
    REGEX,
    MODULO,
    IN,
    CONDITION_OPERATORS
} from './constants.js';
import { isSemver } from './util.js';
import {
    EvaluationContext,
    Overrides
} from '../evaluation/evaluationContext/evaluationContext.types.js';
import { CONSTANTS } from '../features/constants.js';
import { EvaluationResultSegments, SegmentSource } from '../evaluation/models.js';

export const all = (iterable: Array<any>) => iterable.filter(e => !!e).length === iterable.length;
export const any = (iterable: Array<any>) => iterable.filter(e => !!e).length > 0;

export const matchingFunctions = {
    [CONDITION_OPERATORS.EQUAL]: (thisValue: any, otherValue: any) => thisValue == otherValue,
    [CONDITION_OPERATORS.GREATER_THAN]: (thisValue: any, otherValue: any) => otherValue > thisValue,
    [CONDITION_OPERATORS.GREATER_THAN_INCLUSIVE]: (thisValue: any, otherValue: any) =>
        otherValue >= thisValue,
    [CONDITION_OPERATORS.LESS_THAN]: (thisValue: any, otherValue: any) => thisValue > otherValue,
    [CONDITION_OPERATORS.LESS_THAN_INCLUSIVE]: (thisValue: any, otherValue: any) =>
        thisValue >= otherValue,
    [CONDITION_OPERATORS.NOT_EQUAL]: (thisValue: any, otherValue: any) => thisValue != otherValue,
    [CONDITION_OPERATORS.CONTAINS]: (thisValue: any, otherValue: any) => {
        try {
            return !!otherValue && otherValue.includes(thisValue);
        } catch {
            return false;
        }
    }
};

// Semver library throws an error if the version is invalid, in this case, we want to catch and return false
const safeSemverCompare = (
    semverMatchingFunction: (conditionValue: any, traitValue: any) => boolean
) => {
    return (conditionValue: any, traitValue: any) => {
        try {
            return semverMatchingFunction(conditionValue, traitValue);
        } catch {
            return false;
        }
    };
};

export const semverMatchingFunction = {
    ...matchingFunctions,
    [CONDITION_OPERATORS.EQUAL]: safeSemverCompare((conditionValue, traitValue) =>
        semver.eq(traitValue, conditionValue)
    ),
    [CONDITION_OPERATORS.GREATER_THAN]: safeSemverCompare((conditionValue, traitValue) =>
        semver.gt(traitValue, conditionValue)
    ),
    [CONDITION_OPERATORS.GREATER_THAN_INCLUSIVE]: safeSemverCompare((conditionValue, traitValue) =>
        semver.gte(traitValue, conditionValue)
    ),
    [CONDITION_OPERATORS.LESS_THAN]: safeSemverCompare((conditionValue, traitValue) =>
        semver.lt(traitValue, conditionValue)
    ),
    [CONDITION_OPERATORS.LESS_THAN_INCLUSIVE]: safeSemverCompare((conditionValue, traitValue) =>
        semver.lte(traitValue, conditionValue)
    )
};

export const getMatchingFunctions = (semver: boolean) =>
    semver ? semverMatchingFunction : matchingFunctions;

export class SegmentConditionModel {
    EXCEPTION_OPERATOR_METHODS: { [key: string]: string } = {
        [NOT_CONTAINS]: 'evaluateNotContains',
        [REGEX]: 'evaluateRegex',
        [MODULO]: 'evaluateModulo',
        [IN]: 'evaluateIn'
    };

    operator: string;
    value: string | null | undefined | string[];
    property: string | null | undefined;

    constructor(
        operator: string,
        value?: string | null | undefined | string[],
        property?: string | null | undefined
    ) {
        this.operator = operator;
        this.value = value;
        this.property = property;
    }

    matchesTraitValue(traitValue: any) {
        const evaluators: { [key: string]: CallableFunction } = {
            evaluateNotContains: (traitValue: any) => {
                return (
                    typeof traitValue == 'string' &&
                    !!this.value &&
                    !traitValue.includes(this.value?.toString())
                );
            },
            evaluateRegex: (traitValue: any) => {
                try {
                    if (!this.value) {
                        return false;
                    }
                    const regex = new RegExp(this.value?.toString());
                    return !!traitValue?.toString().match(regex);
                } catch {
                    return false;
                }
            },
            evaluateModulo: (traitValue: any) => {
                const parsedTraitValue = parseFloat(traitValue);
                if (isNaN(parsedTraitValue) || !this.value) {
                    return false;
                }

                const parts = this.value.toString().split('|');
                if (parts.length !== 2) {
                    return false;
                }

                const divisor = parseFloat(parts[0]);
                const remainder = parseFloat(parts[1]);

                if (isNaN(divisor) || isNaN(remainder) || divisor === 0) {
                    return false;
                }

                return parsedTraitValue % divisor === remainder;
            },
            evaluateIn: (traitValue: string[] | string) => {
                if (!traitValue || typeof traitValue === 'boolean') {
                    return false;
                }
                if (Array.isArray(this.value)) {
                    return this.value.includes(traitValue.toString());
                }

                if (typeof this.value === 'string') {
                    try {
                        const parsed = JSON.parse(this.value);
                        if (Array.isArray(parsed)) {
                            return parsed.includes(traitValue.toString());
                        }
                    } catch {}
                }
                return this.value?.split(',').includes(traitValue.toString());
            }
        };

        // TODO: move this logic to the evaluator module
        if (this.EXCEPTION_OPERATOR_METHODS[this.operator]) {
            const evaluatorFunction = evaluators[this.EXCEPTION_OPERATOR_METHODS[this.operator]];
            return evaluatorFunction(traitValue);
        }

        const defaultFunction = (x: any, y: any) => false;

        const matchingFunctionSet = getMatchingFunctions(isSemver(this.value));
        const matchingFunction = matchingFunctionSet[this.operator] || defaultFunction;

        const traitType = isSemver(this.value) ? 'semver' : typeof traitValue;
        const castToTypeOfTraitValue = getCastingFunction(traitType);

        return matchingFunction(castToTypeOfTraitValue(this.value), traitValue);
    }
}

export class SegmentRuleModel {
    type: string;
    rules: SegmentRuleModel[] = [];
    conditions: SegmentConditionModel[] = [];

    constructor(type: string) {
        this.type = type;
    }

    static none(iterable: Array<any>) {
        return iterable.filter(e => !!e).length === 0;
    }

    matchingFunction(): CallableFunction {
        return {
            [ANY_RULE]: any,
            [ALL_RULE]: all,
            [NONE_RULE]: SegmentRuleModel.none
        }[this.type] as CallableFunction;
    }
}

export class SegmentModel {
    id: number;
    name: string;
    rules: SegmentRuleModel[] = [];
    featureStates: FeatureStateModel[] = [];

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    static fromSegmentResult(
        segmentResults: EvaluationResultSegments,
        evaluationContext: EvaluationContext
    ): SegmentModel[] {
        const segmentModels: SegmentModel[] = [];
        if (!evaluationContext.segments) {
            return [];
        }

        for (const segmentResult of segmentResults) {
            if (segmentResult.metadata?.source === SegmentSource.IDENTITY_OVERRIDE) {
                continue;
            }
            const segmentMetadataId = segmentResult.metadata?.id;
            if (!segmentMetadataId) {
                continue;
            }
            const segmentContext = evaluationContext.segments[segmentMetadataId.toString()];
            if (segmentContext) {
                const segment = new SegmentModel(segmentMetadataId, segmentContext.name);
                segment.rules = segmentContext.rules.map(rule => new SegmentRuleModel(rule.type));
                segment.featureStates = SegmentModel.createFeatureStatesFromOverrides(
                    segmentContext.overrides || []
                );
                segmentModels.push(segment);
            }
        }

        return segmentModels;
    }

    private static createFeatureStatesFromOverrides(overrides: Overrides): FeatureStateModel[] {
        if (!overrides) return [];
        return overrides
            .filter(override => {
                const overrideMetadataId = override?.metadata?.id;
                return typeof overrideMetadataId === 'number';
            })
            .map(override => {
                const overrideMetadataId = override.metadata!.id as number;
                const feature = new FeatureModel(
                    overrideMetadataId,
                    override.name,
                    override.variants?.length && override.variants.length > 0
                        ? CONSTANTS.MULTIVARIATE
                        : CONSTANTS.STANDARD
                );

                const featureState = new FeatureStateModel(
                    feature,
                    override.enabled,
                    override.priority || 0
                );

                if (override.value !== undefined) {
                    featureState.setValue(override.value);
                }

                if (override.variants && override.variants.length > 0) {
                    featureState.multivariateFeatureStateValues = this.createMultivariateValues(
                        override.variants
                    );
                }

                return featureState;
            });
    }

    private static createMultivariateValues(variants: any[]): MultivariateFeatureStateValueModel[] {
        return variants.map(
            variant =>
                new MultivariateFeatureStateValueModel(
                    new MultivariateFeatureOptionModel(variant.value, variant.id as number),
                    variant.weight as number,
                    variant.id as number
                )
        );
    }
}
