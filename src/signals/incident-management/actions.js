import {
  GET_DISTRICTS,
  GET_DISTRICTS_FAILED,
  GET_DISTRICTS_SUCCESS,
  SEARCH_INCIDENTS,
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  APPLY_FILTER,
  CLEAR_EDIT_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS,
  ORDERING_CHANGED,
  PAGE_CHANGED,
  REMOVE_FILTER_FAILED,
  REMOVE_FILTER_SUCCESS,
  REMOVE_FILTER,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SAVE_FILTER,
  SEARCH_INCIDENTS_ERROR,
  SEARCH_INCIDENTS_SUCCESS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER,
  PATCH_INCIDENT_SUCCESS,
} from './constants';

export const getDistricts = () => ({
  type: GET_DISTRICTS,
});

export const getDistrictsFailed = payload => ({
  type: GET_DISTRICTS_FAILED,
  payload,
});

export const getDistrictsSuccess = payload => ({
  type: GET_DISTRICTS_SUCCESS,
  payload,
});

export const getFiltersSuccess = payload => ({
  type: GET_FILTERS_SUCCESS,
  payload,
});

export const getFiltersFailed = payload => ({
  type: GET_FILTERS_FAILED,
  payload,
});

export const getFilters = () => ({
  type: GET_FILTERS,
});

export const removeFilter = payload => ({
  type: REMOVE_FILTER,
  payload,
});

export const removeFilterSuccess = payload => ({
  type: REMOVE_FILTER_SUCCESS,
  payload,
});

export const removeFilterFailed = payload => ({
  type: REMOVE_FILTER_FAILED,
  payload,
});

export const applyFilter = payload => ({
  type: APPLY_FILTER,
  payload,
});

export const editFilter = payload => ({
  type: EDIT_FILTER,
  payload,
});

export const filterEditCanceled = () => ({
  type: FILTER_EDIT_CANCELED,
});

export const clearEditFilter = () => ({
  type: CLEAR_EDIT_FILTER,
});

export const filterSaved = payload => ({
  type: SAVE_FILTER,
  payload,
});

export const filterSaveFailed = payload => ({
  type: SAVE_FILTER_FAILED,
  payload,
});

export const filterSaveSuccess = payload => ({
  type: SAVE_FILTER_SUCCESS,
  payload,
});

export const filterUpdated = payload => ({
  type: UPDATE_FILTER,
  payload,
});

export const filterUpdatedSuccess = payload => ({
  type: UPDATE_FILTER_SUCCESS,
  payload,
});

export const filterUpdatedFailed = payload => ({
  type: UPDATE_FILTER_FAILED,
  payload,
});

export const pageChanged = page => ({
  type: PAGE_CHANGED,
  payload: page,
});

export const orderingChanged = ordering => ({
  type: ORDERING_CHANGED,
  payload: ordering,
});

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

export const applyFilterRefresh = () => ({
  type: APPLY_FILTER_REFRESH,
});

export const applyFilterRefreshStop = () => ({
  type: APPLY_FILTER_REFRESH_STOP,
});

export const searchIncidents = () => ({
  type: SEARCH_INCIDENTS,
});

export const searchIncidentsSuccess = payload => ({
  type: SEARCH_INCIDENTS_SUCCESS,
  payload,
});

export const searchIncidentsError = payload => ({
  type: SEARCH_INCIDENTS_ERROR,
  payload,
});

export const patchIncidentSuccess = () => ({
  type: PATCH_INCIDENT_SUCCESS,
});
