import {
  REQUEST_INCIDENT,
  REQUEST_INCIDENT_SUCCESS,
  REQUEST_INCIDENT_ERROR,
} from './constants';

import {
  requestIncident,
  requestIncidentSuccess,
  requestIncidentError
} from './actions';

import { testActionCreator } from '../../../../../internals/testing/test-utils';

describe('IncidentDetailPage actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestIncident, REQUEST_INCIDENT, payload);
    testActionCreator(requestIncidentSuccess, REQUEST_INCIDENT_SUCCESS, payload);
    testActionCreator(requestIncidentError, REQUEST_INCIDENT_ERROR, payload);
  });
});
