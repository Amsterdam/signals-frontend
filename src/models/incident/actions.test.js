import { testActionCreator } from 'test/utils';

import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR,
  PATCH_INCIDENT, PATCH_INCIDENT_SUCCESS, PATCH_INCIDENT_ERROR,
  DISMISS_ERROR,
  REQUEST_ATTACHMENTS, REQUEST_ATTACHMENTS_SUCCESS, REQUEST_ATTACHMENTS_ERROR,
  REQUEST_DEFAULT_TEXTS, REQUEST_DEFAULT_TEXTS_SUCCESS, REQUEST_DEFAULT_TEXTS_ERROR,
} from './constants';

import {
  requestIncident, requestIncidentSuccess, requestIncidentError,
  dismissError,
  patchIncident, patchIncidentSuccess, patchIncidentError,
  requestAttachments, requestAttachmentsSuccess, requestAttachmentsError,
  requestDefaultTexts, requestDefaultTextsSuccess, requestDefaultTextsError,
} from './actions';

describe('incidentModel actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestIncident, REQUEST_INCIDENT, payload);
    testActionCreator(requestIncidentSuccess, REQUEST_INCIDENT_SUCCESS, payload);
    testActionCreator(requestIncidentError, REQUEST_INCIDENT_ERROR, payload);

    testActionCreator(patchIncident, PATCH_INCIDENT, payload);
    testActionCreator(patchIncidentSuccess, PATCH_INCIDENT_SUCCESS, payload);
    testActionCreator(patchIncidentError, PATCH_INCIDENT_ERROR, payload);

    testActionCreator(dismissError, DISMISS_ERROR);

    testActionCreator(requestAttachments, REQUEST_ATTACHMENTS, payload);
    testActionCreator(requestAttachmentsSuccess, REQUEST_ATTACHMENTS_SUCCESS, payload);
    testActionCreator(requestAttachmentsError, REQUEST_ATTACHMENTS_ERROR, payload);

    testActionCreator(requestDefaultTexts, REQUEST_DEFAULT_TEXTS, payload);
    testActionCreator(requestDefaultTextsSuccess, REQUEST_DEFAULT_TEXTS_SUCCESS, payload);
    testActionCreator(requestDefaultTextsError, REQUEST_DEFAULT_TEXTS_ERROR, payload);
  });
});
