import { fromJS } from 'immutable';

import { parseInputFormData } from 'signals/shared/filter/parse';
import { makeSelectMainCategories, makeSelectSubCategories } from 'models/categories/selectors';

import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { FILTER_PAGE_SIZE } from './constants';

/**
 * Direct selector to the overviewPage state domain
 */
const selectIncidentManagementDomain = state => (state && state.get('incidentManagement')) || fromJS(initialState);

export const makeSelectDistricts = createSelector([selectIncidentManagementDomain], stateMap =>
  stateMap
    .get('districts')
    .push({ code: 'null', name: 'Niet bepaald' })
    .toJS()
    .map(district => ({
      key: district.type ? `${district.type.code}:${district.code}` : district.code,
      value: district.name,
    }))
);

export const makeSelectAllFilters = createSelector(
  [selectIncidentManagementDomain, makeSelectMainCategories, makeSelectSubCategories],
  (stateMap, maincategory_slug, category_slug) => {
    const filters = stateMap.get('filters').toJS();

    return filters.map(filter => {
      const { priority } = filter.options;
      const converted = (Array.isArray(priority) ? priority : [priority]).filter(Boolean);
      const fltr = {
        ...filter,
        options: {
          ...filter.options,
          priority: converted,
        },
      };

      return parseInputFormData(fltr, {
        maincategory_slug,
        category_slug,
      });
    });
  }
);

export const makeSelectActiveFilter = createSelector(
  [selectIncidentManagementDomain, makeSelectDistricts, makeSelectMainCategories, makeSelectSubCategories],
  (stateMap, area, maincategory_slug, category_slug) => {
    if (!(maincategory_slug && category_slug)) {
      return {};
    }

    const state = stateMap.toJS();

    const { priority } = state.activeFilter.options;
    const converted = (Array.isArray(priority) ? priority : [priority]).filter(Boolean);
    const filter = {
      ...state.activeFilter,
      options: {
        ...state.activeFilter.options,
        priority: converted,
      },
    };

    return parseInputFormData(filter, {
      maincategory_slug,
      category_slug,
      area,
    });
  }
);

export const makeSelectEditFilter = createSelector(
  [selectIncidentManagementDomain, makeSelectDistricts, makeSelectMainCategories, makeSelectSubCategories],
  (stateMap, area, maincategory_slug, category_slug) => {
    if (!(maincategory_slug && category_slug)) {
      return {};
    }

    const state = stateMap.toJS();

    return parseInputFormData(
      state.editFilter,
      {
        maincategory_slug,
        category_slug,
        area,
      },
      (category, value) => {
        if (category.key || category.slug) return undefined;

        return category._links.self.public.endsWith(`/${value}`);
      }
    );
  }
);

export const makeSelectFilterParams = createSelector(selectIncidentManagementDomain, incidentManagementState => {
  const incidentManagement = incidentManagementState.toJS();
  const filter = incidentManagement.activeFilter;
  const { options } = filter;
  const { page } = incidentManagement;
  let { ordering } = incidentManagement;

  if (ordering === 'days_open') {
    ordering = '-created_at';
  }

  if (ordering === '-days_open') {
    ordering = 'created_at';
  }

  const pagingOptions = {
    page,
    ordering,
    page_size: FILTER_PAGE_SIZE,
  };

  return { ...options, ...pagingOptions };
});

export const makeSelectPage = createSelector(selectIncidentManagementDomain, state => {
  const obj = state.toJS();

  return obj.page;
});

export const makeSelectOrdering = createSelector(selectIncidentManagementDomain, state => {
  const obj = state.toJS();

  return obj.ordering;
});

export const makeSelectSearchQuery = createSelector(selectIncidentManagementDomain, state => {
  const obj = state.toJS();

  return obj.searchQuery;
});

export const makeSelectIncidents = createSelector(selectIncidentManagementDomain, state => {
  const { incidents, loading } = state.toJS();

  return { ...incidents, loading };
});

export const makeSelectIncidentsCount = createSelector(selectIncidentManagementDomain, state => {
  const {
    incidents: { count },
  } = state.toJS();

  return count;
});
