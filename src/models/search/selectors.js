import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSearchDomain = state => (state && state.get('search')) || initialState;

export const makeSelectSearch = createSelector(
  selectSearchDomain,
  substate => substate.toJS(),
);

export const makeSelectQuery = createSelector(
  selectSearchDomain,
  substate => {
    const { query } = substate.toJS();
    return query;
  },
);

export default selectSearchDomain;
