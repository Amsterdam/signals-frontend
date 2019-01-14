import { testActionCreator } from '../../../../../internals/testing/test-utils';

import {
  REQUEST_DASHBOARD, REQUEST_DASHBOARD_SUCCESS
}
  from './constants';

import {
  requestDashboard, requestDashboardSuccess
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
  });
});
