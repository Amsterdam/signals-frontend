import { SET_LOCATION, SET_ADDRESS, SET_VALUES } from './constants';

export const setLocationAction = payload => ({
  type: SET_LOCATION,
  payload,
});

export const setAddressAction = payload => ({
  type: SET_ADDRESS,
  payload,
});

export const setValuesAction = payload => ({
  type: SET_VALUES,
  payload,
});
