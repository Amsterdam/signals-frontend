import { SET_QUERY, RESET_QUERY } from './constants';

export const setSearchQuery = (payload) => ({
  type: SET_QUERY,
  payload,
});

export const resetSearchQuery = () => ({
  type: RESET_QUERY,
});
