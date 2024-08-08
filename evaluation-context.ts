export type EvaluationContext = {
    environment?: null | EnvironmentEvaluationContext;
    feature?:     null | FeatureEvaluationContext;
    identity?:    null | IdentityEvaluationContext;
    [property: string]: any;
}

export type EnvironmentEvaluationContext = {
    apiKey: string;
    [property: string]: any;
}

export type FeatureEvaluationContext = {
    name: string;
    [property: string]: any;
}

export type IdentityEvaluationContext = {
    identifier?: null | string;
    traits?:     { [key: string]: null | TraitEvaluationContext };
    transient?:  boolean | null;
    [property: string]: any;
}

export type TraitEvaluationContext = {
    transient?: boolean;
    value:      any;
    [property: string]: any;
}
