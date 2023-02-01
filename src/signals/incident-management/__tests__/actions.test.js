// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { testActionCreator } from 'test/utils'

import * as actions from '../actions'
import * as constants from '../constants'

describe('signals/incident-management/actions', () => {
  it('should dispatch getDistrictsSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.getDistrictsSuccess,
      constants.GET_DISTRICTS_SUCCESS,
      payload
    )
  })

  it('should dispatch getDistrictsFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.getDistrictsFailed,
      constants.GET_DISTRICTS_FAILED,
      payload
    )
  })

  it('should dispatch getDistricts action', () => {
    testActionCreator(actions.getDistricts, constants.GET_DISTRICTS)
  })

  it('should dispatch getFiltersSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.getFiltersSuccess,
      constants.GET_FILTERS_SUCCESS,
      payload
    )
  })

  it('should dispatch getFiltersFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.getFiltersFailed,
      constants.GET_FILTERS_FAILED,
      payload
    )
  })

  it('should dispatch getFilters action', () => {
    testActionCreator(actions.getFilters, constants.GET_FILTERS)
  })

  it('should dispatch removeFilter action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(actions.removeFilter, constants.REMOVE_FILTER, payload)
  })

  it('should dispatch removeFilterSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.removeFilterSuccess,
      constants.REMOVE_FILTER_SUCCESS,
      payload
    )
  })

  it('should dispatch removeFilterFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.removeFilterFailed,
      constants.REMOVE_FILTER_FAILED,
      payload
    )
  })

  it('should dispatch applyFilter action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(actions.applyFilter, constants.APPLY_FILTER, payload)
  })

  it('should dispatch editFilter action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(actions.editFilter, constants.EDIT_FILTER, payload)
  })

  it('should dispatch filterSaved action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(actions.filterSaved, constants.SAVE_FILTER, payload)
  })

  it('should dispatch filterSaveFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.filterSaveFailed,
      constants.SAVE_FILTER_FAILED,
      payload
    )
  })

  it('should dispatch filterSaveSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.filterSaveSuccess,
      constants.SAVE_FILTER_SUCCESS,
      payload
    )
  })

  it('should dispatch filterUpdated action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(actions.filterUpdated, constants.UPDATE_FILTER, payload)
  })

  it('should dispatch filterUpdatedSuccess action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.filterUpdatedSuccess,
      constants.UPDATE_FILTER_SUCCESS,
      payload
    )
  })

  it('should dispatch filterUpdatedFailed action', () => {
    const foo = 'bar'
    const payload = { foo }

    testActionCreator(
      actions.filterUpdatedFailed,
      constants.UPDATE_FILTER_FAILED,
      payload
    )
  })

  it('should dispatch clearEditFilter action', () => {
    testActionCreator(actions.clearEditFilter, constants.CLEAR_EDIT_FILTER)
  })

  it('should dispatch filterEditCanceled action', () => {
    testActionCreator(
      actions.filterEditCanceled,
      constants.FILTER_EDIT_CANCELED
    )
  })

  it('should dispatch pageChanged action', () => {
    const page = 9
    testActionCreator(actions.pageChanged, constants.PAGE_CHANGED, page)
  })

  it('should dispatch orderingChanged action', () => {
    const ordering = 'order-from-asc-to-desc'
    testActionCreator(
      actions.orderingChanged,
      constants.ORDERING_CHANGED,
      ordering
    )
  })

  it('should dispatch requestIncidents action', () => {
    testActionCreator(actions.requestIncidents, constants.REQUEST_INCIDENTS)
  })

  it('should dispatch requestIncidentsSuccess action', () => {
    const incidents = { count: 3, results: [{ id: 1 }, { id: 2 }, { id: 3 }] }
    testActionCreator(
      actions.requestIncidentsSuccess,
      constants.REQUEST_INCIDENTS_SUCCESS,
      incidents
    )
  })

  it('should dispatch requestIncidentsError action', () => {
    const error = new Error('nope')

    testActionCreator(
      actions.requestIncidentsError,
      constants.REQUEST_INCIDENTS_ERROR,
      error
    )
  })

  it('should dispatch applyFilterRefresh action', () => {
    testActionCreator(
      actions.applyFilterRefresh,
      constants.APPLY_FILTER_REFRESH
    )
  })

  it('should dispatch applyFilterRefreshStop action', () => {
    testActionCreator(
      actions.applyFilterRefreshStop,
      constants.APPLY_FILTER_REFRESH_STOP
    )
  })

  it('should dispatch searchIncidents action', () => {
    testActionCreator(actions.searchIncidents, constants.SEARCH_INCIDENTS)
  })

  it('should dispatch searchIncidentsSuccess action', () => {
    const incidents = { count: 3, results: [{ id: 1 }, { id: 2 }, { id: 3 }] }

    testActionCreator(
      actions.searchIncidentsSuccess,
      constants.SEARCH_INCIDENTS_SUCCESS,
      incidents
    )
  })

  it('should dispatch searchIncidentsError action', () => {
    const error = new Error('nope')

    testActionCreator(
      actions.searchIncidentsError,
      constants.SEARCH_INCIDENTS_ERROR,
      error
    )
  })

  it('should dispatch patchIncidentSuccess action', () => {
    testActionCreator(
      actions.patchIncidentSuccess,
      constants.PATCH_INCIDENT_SUCCESS
    )
  })
})
