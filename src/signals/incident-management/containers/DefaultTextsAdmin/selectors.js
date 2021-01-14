import { createSelector } from 'reselect';

/**
 * Direct selector to the defaultTextsAdmin state domain
 */
const selectDefaultTextsAdminDomain = state => state?.defaultTextsAdmin;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DefaultTextsAdmin
 */

const makeSelectDefaultTextsAdmin = () => createSelector(
  selectDefaultTextsAdminDomain,
  substate => substate.toJS()
);

export default makeSelectDefaultTextsAdmin;
