import { fromJS } from 'immutable';

import { parseFromAPIData } from 'signals/shared/filter/parse';
import { makeSelectCategories } from 'containers/App/selectors';

import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the overviewPage state domain
 */
const selectIncidentManagementDomain = (state) =>
  (state && state.get('incidentManagement')) || fromJS(initialState);

export const makeSelectDataLists = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const priority = state.get('priority').toJS();
    const stadsdeel = state.get('stadsdeel').toJS();
    const status = state.get('status').toJS();
    const feedback = state.get('feedback').toJS();

    return {
      priority,
      stadsdeel,
      status,
      feedback,
    };
  },
);

export const makeSelectAllFilters = createSelector(
  selectIncidentManagementDomain,
  makeSelectDataLists,
  makeSelectCategories(),
  (stateMap, dataLists, categories) => {
    const filters = stateMap.get('filters').toJS();

    return filters.map((filter) =>
      parseFromAPIData(filter, {
        ...dataLists,
        maincategory_slug: categories.main,
        category_slug: categories.sub,
      }),
    );
  },
);

export const makeSelectActiveFilter = createSelector(
  selectIncidentManagementDomain,
  makeSelectDataLists,
  makeSelectCategories(),
  (stateMap, dataLists, categories) => {
    const state = stateMap.toJS();
    if (!state.activeFilter) {
      return undefined;
    }

    return parseFromAPIData(state.activeFilter, {
      ...dataLists,
      maincategory_slug: categories.main,
      category_slug: categories.sub,
    });
  },
);

export const makeSelectEditFilter = createSelector(
  selectIncidentManagementDomain,
  makeSelectDataLists,
  makeSelectCategories(),
  (stateMap, dataLists, categories) => {
    const state = stateMap.toJS();
    if (!state.editFilter) {
      const initial = initialState.toJS();
      return initial.editFilter;
    }

    return parseFromAPIData(state.editFilter, {
      ...dataLists,
      maincategory_slug: categories.main,
      category_slug: categories.sub,
    });
  },
);

export const makeSelectFilterParams = createSelector(
  selectIncidentManagementDomain,
  (substate) => {
    const state = substate.toJS();
    const filter = state.activeFilter || { options: {} };
    const { options } = filter;

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
