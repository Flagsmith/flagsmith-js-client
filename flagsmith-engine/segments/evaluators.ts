import * as jsonpathModule from 'jsonpath';
import {
    GenericEvaluationContext,
    InSegmentCondition,
    SegmentCondition,
    SegmentContext,
    SegmentRule
} from '../evaluation/models.js';
import { getHashedPercentageForObjIds } from '../utils/hashing/index.js';
import { SegmentConditionModel } from './models.js';
import { IS_NOT_SET, IS_SET, PERCENTAGE_SPLIT } from './constants.js';

// Handle ESM/CJS interop - jsonpath exports default in ESM
const jsonpath = (jsonpathModule as any).default || jsonpathModule;

/**
 * Returns all segments that the identity belongs to based on segment rules evaluation.
 *
 * An identity belongs to a segment if it matches ALL of the segment's rules.
 * If the context has no identity or segments, returns an empty array.
 *
 * @param context - Evaluation context containing identity and segment definitions
 * @returns Array of segments that the identity matches
 */
export function getIdentitySegments(context: GenericEvaluationContext): SegmentContext[] {
    if (!context.identity || !context.segments) return [];

    return Object.values(context.segments).filter(segment => {
        if (segment.rules.length === 0) return false;
        return segment.rules.every(rule => traitsMatchSegmentRule(rule, segment.key, context));
    });
}

/**
 * Evaluates whether a segment condition matches the identity's traits or context values.
 *
 * Handles different types of conditions:
 * - PERCENTAGE_SPLIT: Deterministic percentage-based bucketing using identity key
 * - IS_SET/IS_NOT_SET: Checks for trait existence
 * - Standard operators: EQUAL, NOT_EQUAL, etc. via SegmentConditionModel
 * - JSONPath expressions: $.identity.identifier, $.environment.name, etc.
 *
 * @param condition - The condition to evaluate (property, operator, value)
 * @param segmentKey - Key of the segment (used for percentage split hashing)
 * @param context - Evaluation context containing identity, traits, and environment
 * @returns true if the condition matches
 */
export function traitsMatchSegmentCondition(
    condition: SegmentCondition | InSegmentCondition,
    segmentKey: string,
    context?: GenericEvaluationContext
): boolean {
    if (condition.operator === PERCENTAGE_SPLIT) {
        let splitKey: string | undefined;

        if (!condition.property) {
            splitKey = context?.identity?.key;
        } else {
            splitKey = getContextValue(condition.property, context);
        }

        if (!splitKey) {
            return false;
        }
        const hashedPercentage = getHashedPercentageForObjIds([segmentKey, splitKey]);
        return hashedPercentage <= parseFloat(String(condition.value));
    }
    if (!condition.property) {
        return false;
    }

    const traitValue = getTraitValue(condition.property, context);

    if (condition.operator === IS_SET) {
        return traitValue !== undefined && traitValue !== null;
    }
    if (condition.operator === IS_NOT_SET) {
        return traitValue === undefined || traitValue === null;
    }

    if (traitValue !== undefined && traitValue !== null) {
        const segmentCondition = new SegmentConditionModel(
            condition.operator,
            condition.value as string,
            condition.property
        );
        return segmentCondition.matchesTraitValue(traitValue);
    }

    return false;
}

function traitsMatchSegmentRule(
    rule: SegmentRule,
    segmentKey: string,
    context?: GenericEvaluationContext
): boolean {
    const matchesConditions = evaluateConditions(rule, segmentKey, context);
    const matchesSubRules = evaluateSubRules(rule, segmentKey, context);

    return matchesConditions && matchesSubRules;
}

function evaluateConditions(
    rule: SegmentRule,
    segmentKey: string,
    context?: GenericEvaluationContext
): boolean {
    if (!rule.conditions || rule.conditions.length === 0) return true;

    const conditionResults = rule.conditions.map((condition: SegmentCondition) =>
        traitsMatchSegmentCondition(condition, segmentKey, context)
    );

    return evaluateRuleConditions(rule.type, conditionResults);
}

function evaluateSubRules(
    rule: SegmentRule,
    segmentKey: string,
    context?: GenericEvaluationContext
): boolean {
    if (!rule.rules || rule.rules.length === 0) return true;

    return rule.rules.every((subRule: SegmentRule) =>
        traitsMatchSegmentRule(subRule, segmentKey, context)
    );
}

function evaluateRuleConditions(ruleType: string, conditionResults: boolean[]): boolean {
    switch (ruleType) {
        case 'ALL':
            return conditionResults.length === 0 || conditionResults.every(result => result);
        case 'ANY':
            return conditionResults.length > 0 && conditionResults.some(result => result);
        case 'NONE':
            return conditionResults.length === 0 || conditionResults.every(result => !result);
        default:
            return false;
    }
}

function getTraitValue(property: string, context?: GenericEvaluationContext): any {
    if (property.startsWith('$.')) {
        const contextValue = getContextValue(property, context);
        if (contextValue !== undefined && isPrimitive(contextValue)) {
            return contextValue;
        }
    }
    const traits = context?.identity?.traits || {};

    return traits[property];
}

function isPrimitive(value: any): boolean {
    if (value === null || value === undefined) {
        return true;
    }

    // Objects and arrays are non-primitive
    return typeof value !== 'object';
}

/**
 * Evaluates JSONPath expressions against the evaluation context.
 *
 * Supports accessing nested context values using JSONPath syntax.
 * Commonly used paths:
 * - $.identity.identifier - User's unique identifier
 * - $.identity.key - User's internal key
 * - $.environment.name - Environment name
 * - $.environment.key - Environment key
 *
 * @param jsonPath - JSONPath expression starting with '$.'
 * @param context - Evaluation context to query against
 * @returns The resolved value, or undefined if path doesn't exist or is invalid
 */
export function getContextValue(jsonPath: string, context?: GenericEvaluationContext): any {
    if (!context || !jsonPath?.startsWith('$.')) return undefined;

    try {
        const normalizedPath = normalizeJsonPath(jsonPath);
        const results = jsonpath.query(context, normalizedPath);
        return results.length > 0 ? results[0] : undefined;
    } catch (error) {
        return undefined;
    }
}

function normalizeJsonPath(jsonPath: string): string {
    return jsonPath.replace(/\.([^.\[\]]+)$/, "['$1']");
}
