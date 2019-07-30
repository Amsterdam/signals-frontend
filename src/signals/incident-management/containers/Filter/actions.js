import { SAVE_FILTER, SAVE_FILTER_FAILED, SAVE_FILTER_SUCCESS } from './constants';

export const filterSaved = (payload) => ({
  type: SAVE_FILTER,
  payload,
});

export const filterSaveFailed = (payload) => ({
  type: SAVE_FILTER_FAILED,
  payload,
});

export const filterSaveSuccess = (payload) => ({
  type: SAVE_FILTER_SUCCESS,
  payload,
});
