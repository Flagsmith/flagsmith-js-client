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
