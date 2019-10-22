import { testActionCreator } from 'test/utils';

import {
  REQUEST_DASHBOARD, REQUEST_DASHBOARD_SUCCESS, REQUEST_DASHBOARD_ERROR, UPDATE_DASHBOARD,
}
  from './constants';

import {
  requestDashboard, requestDashboardSuccess, requestDashboardError, updateDashboard,
} from './actions';


describe('Incident edit actions', () => {
  it('should be created', () => {
    const payload = {
      dashboard: {
        status: [],
        categorie: [],
        hour: [],
        today: {},
      },
    };
    testActionCreator(requestDashboard, REQUEST_DASHBOARD);
    testActionCreator(requestDashboardSuccess, REQUEST_DASHBOARD_SUCCESS, payload);
    testActionCreator(requestDashboardError, REQUEST_DASHBOARD_ERROR, payload);
    testActionCreator(updateDashboard, UPDATE_DASHBOARD);
  });
});
