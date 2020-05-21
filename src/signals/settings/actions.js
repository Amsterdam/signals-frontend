import { SET_USER_FILTERS } from './constants';

export const setUserFilters = payload => ({
  type: SET_USER_FILTERS,
  payload,
});
