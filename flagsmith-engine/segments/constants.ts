// Segment Rules
export const ALL_RULE = 'ALL';
export const ANY_RULE = 'ANY';
export const NONE_RULE = 'NONE';

export const RULE_TYPES = [ALL_RULE, ANY_RULE, NONE_RULE];
export const IDENTITY_OVERRIDE_SEGMENT_NAME = 'identity_overrides';

// Segment Condition Operators
export const EQUAL = 'EQUAL';
export const GREATER_THAN = 'GREATER_THAN';
export const LESS_THAN = 'LESS_THAN';
export const LESS_THAN_INCLUSIVE = 'LESS_THAN_INCLUSIVE';
export const CONTAINS = 'CONTAINS';
export const GREATER_THAN_INCLUSIVE = 'GREATER_THAN_INCLUSIVE';
export const NOT_CONTAINS = 'NOT_CONTAINS';
export const NOT_EQUAL = 'NOT_EQUAL';
export const REGEX = 'REGEX';
export const PERCENTAGE_SPLIT = 'PERCENTAGE_SPLIT';
export const IS_SET = 'IS_SET';
export const IS_NOT_SET = 'IS_NOT_SET';
export const MODULO = 'MODULO';
export const IN = 'IN';

export const CONDITION_OPERATORS = {
    EQUAL,
    GREATER_THAN,
    LESS_THAN,
    LESS_THAN_INCLUSIVE,
    CONTAINS,
    GREATER_THAN_INCLUSIVE,
    NOT_CONTAINS,
    NOT_EQUAL,
    REGEX,
    PERCENTAGE_SPLIT,
    IS_SET,
    IS_NOT_SET,
    MODULO,
    IN
};
