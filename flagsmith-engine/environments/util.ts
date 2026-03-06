import { buildFeatureStateModel } from '../features/util.js';
import { buildIdentityModel } from '../identities/util.js';
import { buildProjectModel } from '../projects/util.js';
import { EnvironmentAPIKeyModel, EnvironmentModel } from './models.js';

export function buildEnvironmentModel(environmentJSON: any) {
    const project = buildProjectModel(environmentJSON.project);
    const featureStates = environmentJSON.feature_states.map((fs: any) =>
        buildFeatureStateModel(fs)
    );
    const environmentModel = new EnvironmentModel(
        environmentJSON.id,
        environmentJSON.api_key,
        project,
        environmentJSON.name
    );
    environmentModel.featureStates = featureStates;
    if (!!environmentJSON.identity_overrides) {
        environmentModel.identityOverrides = environmentJSON.identity_overrides.map(
            (identityData: any) => buildIdentityModel(identityData)
        );
    }
    return environmentModel;
}

export function buildEnvironmentAPIKeyModel(apiKeyJSON: any): EnvironmentAPIKeyModel {
    const model = new EnvironmentAPIKeyModel(
        apiKeyJSON.id,
        apiKeyJSON.key,
        Date.parse(apiKeyJSON.created_at),
        apiKeyJSON.name,
        apiKeyJSON.client_api_key
    );

    return model;
}
