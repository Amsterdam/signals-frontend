import { RESET_LOCATION, SET_LOCATION, SET_ADDRESS, SET_VALUES, SET_LOADING } from './constants';

export const setLocationAction = payload => ({
  type: SET_LOCATION,
  payload,
});

export const resetLocationAction = () => ({
  type: RESET_LOCATION,
});

export const setAddressAction = payload => ({
  type: SET_ADDRESS,
  payload,
});

export const setValuesAction = payload => ({
  type: SET_VALUES,
  payload,
});

export const setLoadingAction = payload => ({
  type: SET_LOADING,
  payload,
});
