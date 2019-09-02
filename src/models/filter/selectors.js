import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectFilters = (state) => state.get('filterModel') || initialState;

export const makeSelectActiveFilter = createSelector(
  selectFilters,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.activeFilter;
  },
);
