import { EvaluationContext, TraitEvaluationContext } from "../evaluation-context";
import { ClientEvaluationContext, ITraits, IFlagsmithTrait } from "../types";

export function isTraitEvaluationContext(trait: TraitEvaluationContext | IFlagsmithTrait): trait is TraitEvaluationContext {
    return !!trait && typeof trait == 'object' && trait.value !== undefined;
}

export function toTraitEvaluationContextObject(traits: ITraits): { [key: string]: null | TraitEvaluationContext } {
    return Object.fromEntries(
        Object.entries(traits).map(
            ([tKey, tValue]) => [tKey, isTraitEvaluationContext(tValue) ? tValue : {value: tValue}]
        )
    );
}

export function toEvaluationContext(clientEvaluationContext: ClientEvaluationContext): EvaluationContext {
    return {
        ...clientEvaluationContext,
        identity: !!clientEvaluationContext.identity ? {
            ...clientEvaluationContext.identity,
            traits: toTraitEvaluationContextObject(clientEvaluationContext.identity.traits || {})
        } : undefined,
    }
}

export function resolveTraitValues(
    traits?: { [key: string]: TraitEvaluationContext | IFlagsmithTrait | null } | null
): Record<string, any> | null {
    if (!traits) return null;
    const entries = Object.entries(traits).filter(([, v]) => v !== null && v !== undefined);
    if (!entries.length) return null;
    return Object.fromEntries(
        entries.map(([k, v]) => [k, isTraitEvaluationContext(v) ? v.value : v])
    );
}
