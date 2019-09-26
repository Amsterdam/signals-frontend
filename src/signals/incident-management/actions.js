import {
  APPLY_FILTER,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  GET_FILTERS,
  REMOVE_FILTER_FAILED,
  REMOVE_FILTER_SUCCESS,
  REMOVE_FILTER,
} from './constants';

export const getFiltersSuccess = (payload) => ({
  type: GET_FILTERS_SUCCESS,
  payload,
});

export const getFiltersFailed = (payload) => ({
  type: GET_FILTERS_FAILED,
  payload,
});

export const getFilters = () => ({
  type: GET_FILTERS,
});

export const removeFilter = (payload) => ({
  type: REMOVE_FILTER,
  payload,
});

export const removeFilterSuccess = (payload) => ({
  type: REMOVE_FILTER_SUCCESS,
  payload,
});

export const removeFilterFailed = (payload) => ({
  type: REMOVE_FILTER_FAILED,
  payload,
});

export const applyFilter = (payload) => ({
  type: APPLY_FILTER,
  payload,
});
