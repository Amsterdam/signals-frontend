import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR
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

export function requestDashboardError(error) {
  return {
    type: REQUEST_DASHBOARD_ERROR,
    payload: error
  };
}
