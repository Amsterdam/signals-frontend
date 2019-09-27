import { parseFromAPIData } from 'signals/shared/filter/parse';
import { makeSelectCategories } from 'containers/App/selectors';

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectIncidentManagementDomain = (state) =>
  state.get('incidentManagement') || initialState;

export const makeSelectPriority = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('priority').toJS(),
  );

export const makeSelectStadsdeel = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('stadsdeel').toJS(),
  );

export const makeSelectStatus = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('status').toJS(),
  );

export const makeSelectFeedback = () =>
  createSelector(
    selectIncidentManagementDomain,
    (state) => state.get('feedback').toJS(),
  );

export const makeSelectDataLists = () =>
  createSelector(
    makeSelectPriority(),
    makeSelectStadsdeel(),
    makeSelectStatus(),
    makeSelectFeedback(),
    (priority, stadsdeel, status, feedback) => ({
      priority,
      stadsdeel,
      status,
      feedback,
    }),
  );

export const makeSelectAllFilters = () =>
  createSelector(
    selectIncidentManagementDomain,
    makeSelectDataLists(),
    makeSelectCategories(),
    (stateMap, dataLists, categories) => {
      const { allFilters } = stateMap.toJS();

      return allFilters.map((filter) =>
        parseFromAPIData(filter, {
          ...dataLists,
          maincategory_slug: categories.main,
          category_slug: categories.sub,
        }),
      );
    },
  );

export const makeSelectFilter = () =>
  createSelector(
    selectIncidentManagementDomain,
    makeSelectDataLists(),
    makeSelectCategories(),
    (stateMap, dataLists, categories) => {
      const state = stateMap.toJS();
      if (!state.filter) {
        return {};
      }

      return parseFromAPIData(state.filter, {
        ...dataLists,
        maincategory_slug: categories.main,
        category_slug: categories.sub,
      });
    },
  );

export const makeSelectFilterParams = () =>
  createSelector(
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
