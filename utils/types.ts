import { IIdentityConfig, IFlagsmithTrait, ITraitConfig } from "../types";

export function isTraitConfig(trait: ITraitConfig | IFlagsmithTrait): trait is ITraitConfig {
    return !!trait && typeof trait == 'object' && trait.value !== undefined;
}

export function isIdentityConfig(identity: IIdentityConfig | string): identity is IIdentityConfig {
    return typeof (identity == 'object') && identity.identifier !== undefined;
}
