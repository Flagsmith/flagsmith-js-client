import { buildFeatureStateModel } from '../features/util.js';
import { SegmentConditionModel, SegmentModel, SegmentRuleModel } from './models.js';

export function buildSegmentConditionModel(segmentConditionJSON: any): SegmentConditionModel {
    return new SegmentConditionModel(
        segmentConditionJSON.operator,
        segmentConditionJSON.value,
        segmentConditionJSON.property_
    );
}

export function buildSegmentRuleModel(ruleModelJSON: any): SegmentRuleModel {
    const ruleModel = new SegmentRuleModel(ruleModelJSON.type);

    ruleModel.rules = ruleModelJSON.rules.map((r: any) => buildSegmentRuleModel(r));
    ruleModel.conditions = ruleModelJSON.conditions.map((c: any) => buildSegmentConditionModel(c));
    return ruleModel;
}

export function buildSegmentModel(segmentModelJSON: any): SegmentModel {
    const model = new SegmentModel(segmentModelJSON.id, segmentModelJSON.name);

    model.featureStates = segmentModelJSON['feature_states'].map((fs: any) =>
        buildFeatureStateModel(fs)
    );
    model.rules = segmentModelJSON['rules'].map((r: any) => buildSegmentRuleModel(r));

    return model;
}

export function isSemver(value: any) {
    return typeof value == 'string' && value.endsWith(':semver');
}

export function removeSemverSuffix(value: string) {
    return value.replace(':semver', '');
}
