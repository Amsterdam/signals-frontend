import { fromJS } from 'immutable';

import { parseInputFormData } from 'signals/shared/filter/parse';
import { makeSelectMainCategories, makeSelectSubCategories } from 'models/categories/selectors';
import configuration from 'shared/services/configuration/configuration';

import { createSelector } from 'reselect';
import { makeSelectDirectingDepartments } from 'models/departments/selectors';
import { makeSelectSources } from '../../containers/App/selectors';
import { initialState } from './reducer';
import { FILTER_PAGE_SIZE } from './constants';

/**
 * Direct selector to the overviewPage state domain
 */
export const selectIncidentManagementDomain = state => state?.incidentManagement || fromJS(initialState);

export const makeSelectDistricts = createSelector([selectIncidentManagementDomain], stateMap =>
  stateMap.get('districts').size
    ? stateMap
      .get('districts')
      .push({ code: 'null', name: 'Niet bepaald' })
      .toJS()
      .map(district => ({
        key: district.code,
        value: district.name,
      }))
    : null
);

export const makeSelectAllFilters = createSelector(
  [
    selectIncidentManagementDomain,
    makeSelectDistricts,
    makeSelectSources,
    makeSelectMainCategories,
    makeSelectSubCategories,
    makeSelectDirectingDepartments,
  ],
  (stateMap, area, source, maincategory_slug, category_slug, directing_department) => {
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
        area,
        directing_department,
        source,
      });
    });
  }
);

export const makeSelectActiveFilter = createSelector(
  [
    selectIncidentManagementDomain,
    makeSelectDistricts,
    makeSelectSources,
    makeSelectMainCategories,
    makeSelectSubCategories,
    makeSelectDirectingDepartments,
  ],
  (stateMap, area, source, maincategory_slug, category_slug, directing_department) => {
    if (!(maincategory_slug && category_slug && directing_department)) {
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
    const fixtures = {
      maincategory_slug,
      category_slug,
      area,
      directing_department,
      source,
    };

    return parseInputFormData(filter, fixtures);
  }
);

export const makeSelectEditFilter = createSelector(
  [
    selectIncidentManagementDomain,
    makeSelectDistricts,
    makeSelectSources,
    makeSelectMainCategories,
    makeSelectSubCategories,
    makeSelectDirectingDepartments,
  ],
  (stateMap, area, source, maincategory_slug, category_slug, directing_department) => {
    if (!(maincategory_slug && category_slug && directing_department)) {
      return {};
    }

    const state = stateMap.toJS();
    const fixtures = {
      maincategory_slug,
      category_slug,
      area,
      directing_department,
      source,
    };

    return parseInputFormData(state.editFilter, fixtures);
  }
);

const filterParamsMap = {
  area: 'area_code',
  areaType: 'area_type_code',
};
const mapFilterParam = param => (filterParamsMap[param] ? filterParamsMap[param] : param);
const orderingMap = {
  days_open: '-created_at',
  '-days_open': 'created_at',
};

export const makeSelectFilterParams = createSelector(selectIncidentManagementDomain, incidentManagementState => {
  const { activeFilter: filter, ordering, page } = incidentManagementState.toJS();
  const pagingOptions = {
    page,
    ordering: orderingMap[ordering] || ordering,
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

export const makeSelectIncidents = createSelector(selectIncidentManagementDomain, state => {
  const { incidents, loadingIncidents } = state.toJS();

  return { ...incidents, loadingIncidents };
});

export const makeSelectIncidentsCount = createSelector(selectIncidentManagementDomain, state => {
  const {
    incidents: { count },
  } = state.toJS();

  return count;
});
