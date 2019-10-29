import {
  SAVE_FILTER,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  UPDATE_FILTER,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER_FAILED,
  CLEAR_FILTER,
} from './constants';

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

export const filterCleared = () => ({
  type: CLEAR_FILTER,
  payload: {},
});
