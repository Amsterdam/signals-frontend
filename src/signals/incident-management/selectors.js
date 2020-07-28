import { fromJS } from 'immutable';

import { parseInputFormData } from 'signals/shared/filter/parse';
import { makeSelectMainCategories, makeSelectSubCategories } from 'models/categories/selectors';
import configuration from 'shared/services/configuration/configuration';

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
      key: district.code,
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

const filterParamsMap = {
  area: 'area_code',
  areaType: 'area_type',
};
const mapFilterParam = param => (filterParamsMap[param] ? filterParamsMap[param] : param);

export const makeSelectFilterParams = createSelector(selectIncidentManagementDomain, incidentManagementState => {
  const { activeFilter: filter, ordering, page } = incidentManagementState.toJS();
  const orderingWithDaysOpen = ordering === 'days_open' ? '-created_at' : ordering;
  const finalOrdering = orderingWithDaysOpen === '-days_open' ? 'created_at' : orderingWithDaysOpen;
  const pagingOptions = {
    page,
    ordering: finalOrdering,
    page_size: FILTER_PAGE_SIZE,
  };
  const options = filter.options.area
    ? { ...filter.options, areaType: configuration.areaTypeCodeForDistrict }
    : filter.options;
  const optionParams = Object.keys(options).reduce((acc, key) => ({ ...acc, [mapFilterParam(key)]: options[key] }), {});

  return {
    ...optionParams,
    ...pagingOptions,
  };
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
