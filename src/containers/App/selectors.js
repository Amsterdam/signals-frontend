import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectGlobal = state => (state && state.get('global')) || initialState;

const selectRoute = state => state.get('route');

const makeSelectUserName = () => createSelector(
  selectGlobal,
  globalState => globalState.get('userName')
);

const makeSelectAccessToken = () => createSelector(
  selectGlobal,
  globalState => globalState.get('accessToken')
);

const makeSelectUserPermissions = () => createSelector(
  selectGlobal,
  globalState => globalState.get('userPermissions').toJS()
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  globalState => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  globalState => globalState.get('error')
);

const makeSelectNotification = () => createSelector(
  selectGlobal,
  globalState => globalState.get('notification').toJS());

const makeSelectLocation = () => createSelector(
  selectRoute,
  routeState => routeState.get('location').toJS()
);

const makeSelectIsAuthenticated = () => createSelector(
  selectGlobal,
  globalState => !globalState.get('accessToken') === false
);

const makeSelectCategories = () => createSelector(
  selectGlobal,
  globalState => globalState.get('categories').toJS()
);


export {
  makeSelectAccessToken,
  makeSelectCategories,
  makeSelectError,
  makeSelectIsAuthenticated,
  makeSelectLoading,
  makeSelectLocation,
  makeSelectNotification,
  makeSelectUserName,
  makeSelectUserPermissions,
  selectGlobal,
};
