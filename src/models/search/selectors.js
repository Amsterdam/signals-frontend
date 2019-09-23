import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSearchDomain = state => (state && state.get('search')) || initialState;

export const makeSelectSearch = createSelector(
  selectSearchDomain,
  substate => substate.toJS(),
);

export const makeSelectQuery = createSelector(
  selectSearchDomain,
  ({ query }) => query,
);

export default selectSearchDomain;
