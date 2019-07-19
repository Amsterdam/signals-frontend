import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFilters = (state) => state.get('filters') || initialState;

export const makeSelectPageTitle = createSelector(
  selectFilters,
  (filters) => filters.pageTitle,
);
