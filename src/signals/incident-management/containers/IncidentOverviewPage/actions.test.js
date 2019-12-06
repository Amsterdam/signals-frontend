import { testActionCreator } from 'test/utils';

import {
  APPLY_FILTER_REFRESH,
  APPLY_FILTER_REFRESH_STOP,
  REQUEST_INCIDENTS,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  // INCIDENT_SELECTED,
  FILTER_INCIDENTS_CHANGED,
} from './constants';

import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  requestIncidents,
  requestIncidentsSuccess,
  requestIncidentsError,
  // incidentSelected,
  filterIncidentsChanged,
} from './actions';

describe('OverviewPage actions', () => {
  it('should be created', () => {
    const payload = { filter: {}, page: {} };
    testActionCreator(requestIncidents, REQUEST_INCIDENTS);
    testActionCreator(requestIncidentsSuccess, REQUEST_INCIDENTS_SUCCESS, payload);
    testActionCreator(requestIncidentsError, REQUEST_INCIDENTS_ERROR, payload);
    // testActionCreator(incidentSelected, INCIDENT_SELECTED, payload);
    testActionCreator(filterIncidentsChanged, FILTER_INCIDENTS_CHANGED, payload);
    testActionCreator(applyFilterRefresh, APPLY_FILTER_REFRESH);
    testActionCreator(applyFilterRefreshStop, APPLY_FILTER_REFRESH_STOP);
  });
});
