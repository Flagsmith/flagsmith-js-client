import { buildFeatureStateModel } from '../features/util.js';
import { IdentityFeaturesList } from '../utils/collections.js';
import { IdentityModel } from './models.js';
import { TraitModel } from './traits/models.js';

export function buildTraitModel(traitJSON: any): TraitModel {
    return new TraitModel(traitJSON.trait_key, traitJSON.trait_value);
}

export function buildIdentityModel(identityJSON: any): IdentityModel {
    // ES5 compatible: create array and push items instead of spread
    const featureList = new IdentityFeaturesList();
    if (identityJSON.identity_features) {
        const features = identityJSON.identity_features.map((f: any) => buildFeatureStateModel(f));
        for (let i = 0; i < features.length; i++) {
            featureList.push(features[i]);
        }
    }

    const model = new IdentityModel(
        identityJSON.created_date,
        identityJSON.identity_traits
            ? identityJSON.identity_traits.map((trait: any) => buildTraitModel(trait))
            : [],
        featureList,
        identityJSON.environment_api_key,
        identityJSON.identifier,
        identityJSON.identity_uuid
    );

    model.djangoID = identityJSON.django_id;
    return model;
}
