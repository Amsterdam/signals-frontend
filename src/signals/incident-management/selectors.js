// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import {
  makeSelectMainCategories,
  makeSelectSubCategories,
} from 'models/categories/selectors'
import {
  makeSelectDirectingDepartments,
  makeSelectRoutingDepartments,
} from 'models/departments/selectors'
import { createSelector } from 'reselect'
import configuration from 'shared/services/configuration/configuration'
import {
  mapFilterParams,
  mapOrdering,
  parseInputFormData,
} from 'signals/shared/filter/parse'

import { FILTER_PAGE_SIZE } from './constants'
import { initialState } from './reducer'
import { makeSelectSources } from '../../containers/App/selectors'

/**
 * Direct selector to the overviewPage state domain
 */
export const selectIncidentManagementDomain = (state) =>
  state?.incidentManagement || fromJS(initialState)

export const makeSelectDistricts = createSelector(
  [selectIncidentManagementDomain],
  (stateMap) =>
    stateMap.get('districts').size
      ? stateMap
          .get('districts')
          .push({ code: 'null', name: 'Niet bepaald' })
          .toJS()
          .map((district) => ({
            key: district.code,
            value: district.name,
          }))
      : null
)

export const makeSelectGGWDistricts = createSelector(
  [selectIncidentManagementDomain],
  (stateMap) =>
    stateMap.get('ggwDistricts').size
      ? stateMap
          .get('ggwDistricts')
          .push({ code: 'null', name: 'Niet bepaald' })
          .toJS()
          .map((ddwDistrict) => ({
            key: ddwDistrict.code,
            value: ddwDistrict.name,
          }))
      : null
)

// TODO: Create GGW gebieden selector

export const makeSelectFixtures = createSelector(
  [
    makeSelectDistricts,
    makeSelectGGWDistricts,
    makeSelectSources,
    makeSelectMainCategories,
    makeSelectSubCategories,
    makeSelectDirectingDepartments,
    makeSelectRoutingDepartments,
  ],
  (
    area,
    source,
    maincategory_slug,
    category_slug,
    directing_department,
    routing_department
  ) => ({
    maincategory_slug,
    category_slug,
    area,
    directing_department,
    routing_department,
    source,
  })
)

export const makeSelectAllFilters = createSelector(
  [selectIncidentManagementDomain, makeSelectFixtures],
  (stateMap, fixtures) => {
    const filters = stateMap.get('filters').toJS()
    return filters.map((filter) => {
      const { priority } = filter.options
      const converted = (
        Array.isArray(priority) ? priority : [priority]
      ).filter(Boolean)
      const fltr = {
        ...filter,
        options: {
          ...filter.options,
          priority: converted,
        },
      }

      return parseInputFormData(fltr, fixtures)
    })
  }
)

export const makeSelectFiltersOnOverview = createSelector(
  [makeSelectAllFilters],
  (filters) => filters.filter(({ show_on_overview }) => show_on_overview)
)

export const makeSelectActiveFilter = createSelector(
  [selectIncidentManagementDomain, makeSelectFixtures],
  (stateMap, fixtures) => {
    if (
      !(
        fixtures.maincategory_slug &&
        fixtures.category_slug &&
        fixtures.directing_department
      )
    ) {
      return {}
    }

    const state = stateMap.toJS()
    const { priority } = state.activeFilter.options

    const converted = (Array.isArray(priority) ? priority : [priority]).filter(
      Boolean
    )
    const filter = {
      ...state.activeFilter,
      options: {
        ...state.activeFilter.options,
        priority: converted,
      },
    }

    return parseInputFormData(filter, fixtures)
  }
)

export const makeSelectEditFilter = createSelector(
  [selectIncidentManagementDomain, makeSelectFixtures],
  (stateMap, fixtures) =>
    fixtures.maincategory_slug &&
    fixtures.category_slug &&
    fixtures.directing_department
      ? parseInputFormData(stateMap.toJS().editFilter, fixtures)
      : {}
)

export const makeSelectFilterParams = createSelector(
  selectIncidentManagementDomain,
  (incidentManagementState) => {
    const {
      activeFilter: filter,
      ordering,
      page,
    } = incidentManagementState.toJS()
    const pagingOptions = {
      page,
      ordering: mapOrdering(ordering),
      page_size: FILTER_PAGE_SIZE,
    }
    const filterOptions =
      filter.options.area && filter.options.area[0] !== 'null'
        ? // TODO: set correct areaType
          { ...filter.options, areaType: configuration.areaTypeCodeForDistrict }
        : filter.options

    return {
      ...mapFilterParams(filterOptions),
      ...pagingOptions,
    }
  }
)

export const makeSelectPage = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const obj = state.toJS()

    return obj.page
  }
)

export const makeSelectOrdering = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const obj = state.toJS()

    return obj.ordering
  }
)

export const makeSelectIncidents = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const { incidents, loadingIncidents } = state.toJS()

    return { ...incidents, loadingIncidents }
  }
)

export const makeSelectErrorMessage = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const obj = state.toJS()

    return obj.errorMessage
  }
)

export const makeSelectIncidentsCount = createSelector(
  selectIncidentManagementDomain,
  (state) => {
    const {
      incidents: { count },
    } = state.toJS()

    return count
  }
)
