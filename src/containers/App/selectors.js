import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state.global || initialState;

const selectRoute = state => state.route;

const makeSelectUserName = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.userName,
  );

const makeSelectAccessToken = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.accessToken,
  );

const makeSelectUserPermissions = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.userPermissions,
  );

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.loading,
  );

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.error,
  );

const makeSelectErrorMessage = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.errorMessage,
  );

const makeSelectLocation = () =>
  createSelector(
    selectRoute,
    routeState => routeState.location,
  );

const makeSelectIsAuthenticated = () =>
  createSelector(
    selectGlobal,
    globalState => !globalState.accessToken === false,
  );

const makeSelectCategories = () =>
  createSelector(
    selectGlobal,
    globalState => globalState.categories,
  );

export {
  selectGlobal,
  makeSelectUserName,
  makeSelectAccessToken,
  makeSelectUserPermissions,
  makeSelectLoading,
  makeSelectError,
  makeSelectErrorMessage,
  makeSelectLocation,
  makeSelectIsAuthenticated,
  makeSelectCategories,
};
