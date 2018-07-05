import { createSelector } from 'reselect';

const selectGlobal = (state) => state.get('global');

const selectRoute = (state) => state.get('route');

const makeSelectUserName = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('userName')
);

const makeSelectAccessToken = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('accessToken')
);

const makeSelectLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loading')
);

const makeSelectError = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('error')
);

const makeSelectLocation = () => createSelector(
  selectRoute,
  (routeState) => routeState.get('location').toJS()
);

export {
  selectGlobal,
  makeSelectAccessToken,
  makeSelectLoading,
  makeSelectError,
  makeSelectLocation,
  makeSelectUserName
};
