import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  FILTER_INCIDENTS_CHANGED,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  SEARCH_INCIDENTS,
  RESET_SEARCH_INCIDENTS,
} from './constants';

export const requestIncidents = () => ({
  type: REQUEST_INCIDENTS,
});

export const requestIncidentsSuccess = payload => ({
  type: REQUEST_INCIDENTS_SUCCESS,
  payload,
});

export const requestIncidentsError = payload => ({
  type: REQUEST_INCIDENTS_ERROR,
  payload,
});

export const filterIncidentsChanged = payload => ({
  type: FILTER_INCIDENTS_CHANGED,
  payload,
});

export const applyFilterRefresh = () => ({
  type: APPLY_FILTER_REFRESH,
});

export const applyFilterRefreshStop = () => ({
  type: APPLY_FILTER_REFRESH_STOP,
});

export const searchIncidents = payload => ({
  type: SEARCH_INCIDENTS,
  payload,
});

export const resetSearchIncidents = () => ({
  type: RESET_SEARCH_INCIDENTS,
});
