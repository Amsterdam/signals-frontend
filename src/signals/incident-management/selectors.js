// import { parseAPIData } from 'signals/incident-management/shared/filter/parse';
import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectIncidentManagementDomain = (state) =>
  state.get('incidentManagement') || initialState;

export const makeSelectPriorityList = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('priorityList').toJS(),
  );

export const makeSelectStadsdeelList = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('stadsdeelList').toJS(),
  );

export const makeSelectStatusList = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('statusList').toJS(),
  );

export const makeSelectFeedbackList = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('feedbackList').toJS(),
  );

export const makeSelectDataLists = () =>
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

export const makeSelectAllFilters = createSelector(
  selectIncidentManagementDomain,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.allFilters;
  },
);

export const makeSelectFilter = createSelector(
  selectIncidentManagementDomain,
  (stateMap) => {
    const state = stateMap.toJS();

    return state.filter;
  },
);

export const makeSelectFilterParams = createSelector(
  selectIncidentManagementDomain,
  (substate) => {
    const state = substate.toJS();
    const filter = state.filter || { options: {} };
    const { options } = filter;

    if (options && options.id) {
      delete options.id;
    }

    if (filter.searchQuery) {
      return {
        id: filter.searchQuery,
        page: state.page,
        ordering: state.sort,
      };
    }

    return { ...options, page: state.page, ordering: state.sort };
  },
);
