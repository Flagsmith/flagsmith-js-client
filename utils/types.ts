import { TraitEvaluationContext } from "../evaluation-context";
import { IFlagsmithTrait } from "../types";

export function isTraitEvaluationContext(trait: TraitEvaluationContext | IFlagsmithTrait): trait is TraitEvaluationContext {
    return !!trait && typeof trait == 'object' && trait.value !== undefined;
}
