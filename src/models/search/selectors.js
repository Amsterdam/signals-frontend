import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectSearchDomain = (state) =>
  (state && state.get('search')) || initialState;

const makeSelectSearch = createSelector(
  selectSearchDomain,
  (substate) => substate.toJS(),
);

export { makeSelectSearch as default, selectSearchDomain };
