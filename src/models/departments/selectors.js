import { createSelector } from 'reselect';
import { initialState } from './reducer';

export const selectDepartmentsDomain = state => (state && state.get('departments')) || initialState;

export const makeSelectDepartments = createSelector(
  selectDepartmentsDomain,
  state => state.toJS()
);

export const makeSelectDirectingDepartments = createSelector(
  makeSelectDepartments,
  state => state?.list.filter(department => department.can_direct)
);
