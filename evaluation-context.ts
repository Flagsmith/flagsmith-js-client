export interface EvaluationContext {
    environment?: null | EnvironmentEvaluationContext;
    feature?:     null | FeatureEvaluationContext;
    identity?:    null | IdentityEvaluationContext;
    [property: string]: any;
}

export interface EnvironmentEvaluationContext {
    apiKey: string;
    [property: string]: any;
}

export interface FeatureEvaluationContext {
    name: string;
    [property: string]: any;
}

export interface IdentityEvaluationContext {
    identifier?: null | string;
    traits?:     { [key: string]: null | TraitEvaluationContext };
    transient?:  boolean | null;
    [property: string]: any;
}

export interface TraitEvaluationContext {
    transient?: boolean;
    value:      any;
    [property: string]: any;
}
