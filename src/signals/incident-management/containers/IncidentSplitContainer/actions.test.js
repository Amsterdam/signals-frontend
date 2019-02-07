import {
  SPLIT_INCIDENT // , REQUEST_INCIDENT_SUCCESS, REQUEST_INCIDENT_ERROR
} from './constants';

import {
  splitIncident // , requestIncidentSuccess, requestIncidentError
} from './actions';

import { testActionCreator } from '../../../../../internals/testing/test-utils';

describe('IncidentSplitontainer actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(splitIncident, SPLIT_INCIDENT, payload);
    // testActionCreator(requestIncidentSuccess, REQUEST_INCIDENT_SUCCESS, payload);
    // testActionCreator(requestIncidentError, REQUEST_INCIDENT_ERROR, payload);
  });
});
