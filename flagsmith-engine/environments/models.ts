import { FeatureStateModel } from '../features/models.js';
import { IdentityModel } from '../identities/models.js';
import { ProjectModel } from '../projects/models.js';

export class EnvironmentAPIKeyModel {
    id: number;
    key: string;
    createdAt: number;
    name: string;
    clientApiKey: string;
    expiresAt?: number;
    active = true;

    constructor(
        id: number,
        key: string,
        createdAt: number,
        name: string,
        clientApiKey: string,
        expiresAt?: number
    ) {
        this.id = id;
        this.key = key;
        this.createdAt = createdAt;
        this.name = name;
        this.clientApiKey = clientApiKey;
        this.expiresAt = expiresAt;
    }

    isValid() {
        return !!this.active && (!this.expiresAt || this.expiresAt > Date.now());
    }
}

export class EnvironmentModel {
    id: number;
    apiKey: string;
    project: ProjectModel;
    featureStates: FeatureStateModel[] = [];
    identityOverrides: IdentityModel[] = [];
    name: string;

    constructor(id: number, apiKey: string, project: ProjectModel, name: string) {
        this.id = id;
        this.apiKey = apiKey;
        this.project = project;
        this.name = name;
    }
}
