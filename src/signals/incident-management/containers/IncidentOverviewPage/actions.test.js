import { testActionCreator } from 'test/utils';

import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  FILTER_INCIDENTS_CHANGED,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  RESET_SEARCH_INCIDENTS,
  SEARCH_INCIDENTS,
} from './constants';

import {
  applyFilterRefresh,
  applyFilterRefreshStop,
  filterIncidentsChanged,
  requestIncidents,
  requestIncidentsError,
  requestIncidentsSuccess,
  resetSearchIncidents,
  searchIncidents,
} from './actions';

describe('OverviewPage actions', () => {
  it('should be created', () => {
    const payload = { filter: {}, page: {} };
    testActionCreator(requestIncidents, REQUEST_INCIDENTS);
    testActionCreator(requestIncidentsSuccess, REQUEST_INCIDENTS_SUCCESS, payload);
    testActionCreator(requestIncidentsError, REQUEST_INCIDENTS_ERROR, payload);
    testActionCreator(filterIncidentsChanged, FILTER_INCIDENTS_CHANGED, payload);
    testActionCreator(applyFilterRefresh, APPLY_FILTER_REFRESH);
    testActionCreator(applyFilterRefreshStop, APPLY_FILTER_REFRESH_STOP);
    testActionCreator(searchIncidents, SEARCH_INCIDENTS, 'string to look for');
    testActionCreator(resetSearchIncidents, RESET_SEARCH_INCIDENTS);
  });
});
