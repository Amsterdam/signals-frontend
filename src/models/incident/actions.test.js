import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR, RESET_SPLIT_STATE
} from './constants';

import {
  requestIncident, requestIncidentSuccess, requestIncidentError, resetSplitState
} from './actions';

import { testActionCreator } from '../../../internals/testing/test-utils';

describe('incidentModel actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestIncident, REQUEST_INCIDENT, payload);
    testActionCreator(requestIncidentSuccess, REQUEST_INCIDENT_SUCCESS, payload);
    testActionCreator(requestIncidentError, REQUEST_INCIDENT_ERROR, payload);
    testActionCreator(resetSplitState, RESET_SPLIT_STATE);
  });
});
