import {
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  INCIDENT_SELECTED,
  FILTER_INCIDENTS_CHANGED
} from './constants';

import {
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  incidentSelected,
  filterIncidentsChanged
} from './actions';

import { testActionCreator } from '../../../../../internals/testing/test-utils';

describe('OverviewPage actions', () => {
  it('should be created', () => {
    const payload = { prop: {} };
    testActionCreator(requestIncidents, REQUEST_INCIDENTS, payload);
    testActionCreator(requestIncidentsSuccess, REQUEST_INCIDENTS_SUCCESS, payload);
    testActionCreator(requestIncidentsError, REQUEST_INCIDENTS_ERROR, payload);
    testActionCreator(incidentSelected, INCIDENT_SELECTED, payload);
    testActionCreator(filterIncidentsChanged, FILTER_INCIDENTS_CHANGED, payload);
  });
});
