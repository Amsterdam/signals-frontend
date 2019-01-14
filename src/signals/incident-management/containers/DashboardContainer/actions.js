import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS
} from './constants';

export function requestDashboard() {
  return {
    type: REQUEST_DASHBOARD
  };
}

export function requestDashboardSuccess(results) {
  return {
    type: REQUEST_DASHBOARD_SUCCESS,
    payload: results
  };
}
