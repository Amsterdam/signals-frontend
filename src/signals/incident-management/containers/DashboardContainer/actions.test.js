import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  REQUEST_DASHBOARD, REQUEST_DASHBOARD_SUCCESS, REQUEST_DASHBOARD_ERROR
}
  from './constants';

import {
  requestDashboard, requestDashboardSuccess, requestDashboardError
} from './actions';


describe('Incident edit actions', () => {
  it('should be created', () => {
    const payload = { dashboard: {
      status: [],
      categorie: [],
      hour: [],
      today: {}
    } };
    testActionCreator(requestDashboard, REQUEST_DASHBOARD);
    testActionCreator(requestDashboardSuccess, REQUEST_DASHBOARD_SUCCESS, payload);
    testActionCreator(requestDashboardError, REQUEST_DASHBOARD_ERROR, payload);
  });
});
