import {
  REQUEST_INCIDENT, REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR, RESET_SPLIT
} from './constants';

import {
  requestIncident, requestIncidentSuccess, requestIncidentError, resetSplit
} from './actions';

import { testActionCreator } from '../../../internals/testing/test-utils';

describe('incidentModel actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestIncident, REQUEST_INCIDENT, payload);
    testActionCreator(requestIncidentSuccess, REQUEST_INCIDENT_SUCCESS, payload);
    testActionCreator(requestIncidentError, REQUEST_INCIDENT_ERROR, payload);
    testActionCreator(resetSplit, RESET_SPLIT);
  });
});
