import { testActionCreator } from 'test/utils';

import {
  SPLIT_INCIDENT, SPLIT_INCIDENT_SUCCESS, SPLIT_INCIDENT_ERROR,
} from './constants';

import {
  splitIncident, splitIncidentSuccess, splitIncidentError,
} from './actions';

describe('IncidentSplitontainer actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(splitIncident, SPLIT_INCIDENT, payload);
    testActionCreator(splitIncidentSuccess, SPLIT_INCIDENT_SUCCESS, payload);
    testActionCreator(splitIncidentError, SPLIT_INCIDENT_ERROR, payload);
  });
});
