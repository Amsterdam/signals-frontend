import {
  REQUEST_DASHBOARD,
  REQUEST_DASHBOARD_SUCCESS,
  REQUEST_DASHBOARD_ERROR,
  UPDATE_DASHBOARD,
} from './constants';

export function requestDashboard() {
  return {
    type: REQUEST_DASHBOARD,
  };
}

export function requestDashboardSuccess(results) {
  return {
    type: REQUEST_DASHBOARD_SUCCESS,
    payload: results,
  };
}

export function requestDashboardError(error) {
  return {
    type: REQUEST_DASHBOARD_ERROR,
    payload: error,
  };
}

export function updateDashboard() {
  return {
    type: UPDATE_DASHBOARD,
  };
}
