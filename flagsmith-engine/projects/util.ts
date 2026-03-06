import { buildOrganizationModel } from '../organisations/util.js';
import { SegmentModel } from '../segments/models.js';
import { buildSegmentModel } from '../segments/util.js';
import { ProjectModel } from './models.js';

export function buildProjectModel(projectJSON: any): ProjectModel {
    const segments: SegmentModel[] = projectJSON['segments']
        ? projectJSON['segments'].map((s: any) => buildSegmentModel(s))
        : [];
    const model = new ProjectModel(
        projectJSON.id,
        projectJSON.name,
        projectJSON.hide_disabled_flags,
        buildOrganizationModel(projectJSON.organisation)
    );
    model.segments = segments;
    return model;
}
