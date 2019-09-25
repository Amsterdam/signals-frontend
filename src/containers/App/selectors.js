import { createSelector } from 'reselect';

import { initialState } from './reducer';

const selectGlobal = (state) => (state && state.get('global')) || initialState;

const selectRoute = (state) => state.get('route');

const makeSelectUserName = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('userName'),
  );

const makeSelectAccessToken = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('accessToken'),
  );

const makeSelectUserPermissions = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('userPermissions').toJS(),
  );

const makeSelectLoading = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('loading'),
  );

const makeSelectError = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('error'),
  );

const makeSelectErrorMessage = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('errorMessage'),
  );

const makeSelectLocation = () =>
  createSelector(
    selectRoute,
    (routeState) => routeState.get('location').toJS(),
  );

const makeSelectIsAuthenticated = () =>
  createSelector(
    selectGlobal,
    (globalState) => !globalState.get('accessToken') === false,
  );

const makeSelectCategories = () =>
  createSelector(
    selectGlobal,
    (globalState) => globalState.get('categories').toJS(),
  );

const makeSelectPriorityList = () =>
  createSelector(
    selectGlobal,
    (state) => state.get('priorityList').toJS(),
  );

const makeSelectStadsdeelList = () =>
  createSelector(
    selectGlobal,
    (state) => state.get('stadsdeelList').toJS(),
  );

const makeSelectStatusList = () =>
  createSelector(
    selectGlobal,
    (state) => state.get('statusList').toJS(),
  );

const makeSelectFeedbackList = () =>
  createSelector(
    selectGlobal,
    (state) => state.get('feedbackList').toJS(),
  );

const makeSelectDataLists = () =>
  createSelector(
    makeSelectPriorityList(),
    makeSelectStadsdeelList(),
    makeSelectStatusList(),
    makeSelectFeedbackList(),
    (priority, stadsdeel, status, feedback) => ({
      priority,
      stadsdeel,
      status,
      feedback,
    }),
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
  makeSelectPriorityList,
  makeSelectStadsdeelList,
  makeSelectStatusList,
  makeSelectFeedbackList,
  makeSelectDataLists,
};
