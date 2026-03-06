import { IdentityFeaturesList } from '../utils/collections.js';
import { TraitModel } from './traits/models.js';

import { randomUUID as uuidv4 } from '../utils/crypto-polyfill.js';

export class IdentityModel {
    identifier: string;
    environmentApiKey: string;
    createdDate?: number;
    identityFeatures: IdentityFeaturesList;
    identityTraits: TraitModel[];
    identityUuid: string;
    djangoID: number | undefined;

    constructor(
        created_date: string,
        identityTraits: TraitModel[],
        identityFeatures: IdentityFeaturesList,
        environmentApiKey: string,
        identifier: string,
        identityUuid?: string,
        djangoID?: number
    ) {
        this.identityUuid = identityUuid || uuidv4();
        this.createdDate = Date.parse(created_date) || Date.now();
        this.identityTraits = identityTraits;
        // ES5 compatible: create array and copy items
        this.identityFeatures = new IdentityFeaturesList();
        for (let i = 0; i < identityFeatures.length; i++) {
            this.identityFeatures.push(identityFeatures[i]);
        }
        this.environmentApiKey = environmentApiKey;
        this.identifier = identifier;
        this.djangoID = djangoID;
    }

    get compositeKey() {
        return IdentityModel.generateCompositeKey(this.environmentApiKey, this.identifier);
    }

    static generateCompositeKey(env_key: string, identifier: string) {
        return `${env_key}_${identifier}`;
    }

    updateTraits(traits: TraitModel[]) {
        const existingTraits: Map<string, TraitModel> = new Map();
        for (const trait of this.identityTraits) {
            existingTraits.set(trait.traitKey, trait);
        }

        for (const trait of traits) {
            if (!!trait.traitValue) {
                existingTraits.set(trait.traitKey, trait);
            } else {
                existingTraits.delete(trait.traitKey);
            }
        }

        this.identityTraits = [];

        for (const [k, v] of existingTraits.entries()) {
            this.identityTraits.push(v);
        }
    }
}
