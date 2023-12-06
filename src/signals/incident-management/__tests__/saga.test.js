// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { push } from 'redux-first-history'
import { call, select, takeLatest, take } from 'redux-saga/effects'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { throwError } from 'redux-saga-test-plan/providers'

import { SET_SEARCH_QUERY, RESET_SEARCH_QUERY } from 'containers/App/constants'
import { makeSelectSearchQuery } from 'containers/App/selectors'
import {
  authCall,
  authDeleteCall,
  authPatchCall,
  authPostCall,
} from 'shared/services/api/api'
import CONFIGURATION from 'shared/services/configuration/configuration'
import incidentsJSON from 'utils/__tests__/fixtures/incidents.json'

import {
  filterSaveFailed,
  filterSaveSuccess,
  filterUpdatedFailed,
  filterUpdatedSuccess,
  getDistrictsFailed,
  getDistrictsSuccess,
  getFilters,
  getFiltersFailed,
  getFiltersSuccess,
  removeFilterFailed,
  removeFilterSuccess,
  searchIncidentsSuccess,
  searchIncidentsError,
  requestIncidentsSuccess,
  applyFilterRefreshStop,
  applyFilterRefresh,
  requestIncidentsError,
  requestIncidents,
} from '../actions'
import {
  APPLY_FILTER_REFRESH_STOP,
  APPLY_FILTER_REFRESH,
  APPLY_FILTER,
  CLEAR_FILTERS,
  GET_DISTRICTS,
  GET_FILTERS,
  REMOVE_FILTER,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SAVE_FILTER,
  UPDATE_FILTER_SUCCESS,
  UPDATE_FILTER,
  SEARCH_INCIDENTS,
  REQUEST_INCIDENTS,
  PAGE_CHANGED,
  ORDERING_CHANGED,
  PATCH_INCIDENT_SUCCESS,
} from '../constants'
import watchIncidentManagementSaga, {
  fetchProxy,
  doSaveFilter,
  doUpdateFilter,
  fetchDistricts,
  fetchFilters,
  refreshIncidents,
  removeFilter,
  saveFilter,
  updateFilter,
  fetchIncidents,
  searchIncidents,
} from '../saga'
import { makeSelectActiveFilter, makeSelectFilterParams } from '../selectors'

describe('signals/incident-management/saga', () => {
  it('should watchIncidentManagementSaga', () => {
    testSaga(watchIncidentManagementSaga)
      .next()
      .all([
        takeLatest(GET_DISTRICTS, fetchDistricts),
        takeLatest(GET_FILTERS, fetchFilters),
        takeLatest(REMOVE_FILTER, removeFilter),
        takeLatest(SAVE_FILTER, saveFilter),
        takeLatest(UPDATE_FILTER, updateFilter),
        takeLatest(
          [
            APPLY_FILTER,
            CLEAR_FILTERS,
            SEARCH_INCIDENTS,
            REQUEST_INCIDENTS,
            SET_SEARCH_QUERY,
            RESET_SEARCH_QUERY,
            PAGE_CHANGED,
            ORDERING_CHANGED,
            PATCH_INCIDENT_SUCCESS,
          ],
          fetchProxy
        ),
      ])
      .next()
      .take(APPLY_FILTER_REFRESH)
      .next()
      .race([call(refreshIncidents), take(APPLY_FILTER_REFRESH_STOP)])
      .finish()
      .next()
      .isDone()
  })

  describe('fetch proxy', () => {
    it('should call fetchIncidents', () =>
      expectSaga(fetchProxy)
        .provide([[select(makeSelectSearchQuery), undefined]])
        .call(fetchIncidents)
        .run())

    it('should call searchIncidents', () => {
      const searchQuery = 'stoeptegels'
      const action = { payload: searchQuery }

      return expectSaga(fetchProxy, action)
        .provide([[select(makeSelectSearchQuery), searchQuery]])
        .call(searchIncidents, action)
        .run()
    })
  })

  describe('fetch incidents', () => {
    it('should fetchIncidents success', () => {
      const filter = { name: 'filter', refresh: false }
      const page = 2
      const ordering = '-created_at'
      const incidents = { 0: {}, 1: {}, orderedAs: '-created_at' }
      const params = { test: 'test' }
      const filterParams = {
        page,
        ordering,
        ...params,
      }

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectActiveFilter), filter],
          [select(makeSelectFilterParams), filterParams],
          [matchers.call.fn(authCall), incidents],
        ])
        .select(makeSelectActiveFilter)
        .put(requestIncidentsSuccess(incidents))
        .run()
    })

    it('should stop and start filter refresh', () => {
      const filter = { name: 'filter', refresh: true }

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectActiveFilter), filter],
          [matchers.call.fn(authCall), []],
        ])
        .select(makeSelectActiveFilter)
        .put(applyFilterRefreshStop())
        .put(applyFilterRefresh())
        .run()
    })

    it('should dispatch fetchIncidents error', () => {
      const message = '404 Not Found'
      const error = new Error(message)

      return expectSaga(fetchIncidents)
        .provide([
          [select(makeSelectFilterParams), {}],
          [matchers.call.fn(authCall), throwError(error)],
        ])
        .select(makeSelectFilterParams)
        .call.like(authCall)
        .put(requestIncidentsError(message))
        .run()
    })

    it('should fetch incidents clear filter', () =>
      expectSaga(watchIncidentManagementSaga)
        .provide([
          [select(makeSelectActiveFilter), {}],
          [matchers.call.fn(authCall), []],
        ])
        .put(requestIncidentsSuccess({ orderedAs: '' }))
        .dispatch({ type: CLEAR_FILTERS })
        .silentRun())

    it('should fetch incidents after page change', () =>
      expectSaga(watchIncidentManagementSaga)
        .provide([
          [select(makeSelectActiveFilter), {}],
          [matchers.call.fn(authCall), []],
        ])
        .put(requestIncidentsSuccess({ orderedAs: '' }))
        .dispatch({ type: PAGE_CHANGED, payload: 4 })
        .silentRun())

    it('should fetch incidents after sort change', () =>
      expectSaga(watchIncidentManagementSaga)
        .provide([
          [select(makeSelectActiveFilter), {}],
          [matchers.call.fn(authCall), []],
        ])
        .put(requestIncidentsSuccess({ orderedAs: '' }))
        .dispatch({
          type: ORDERING_CHANGED,
          payload: 'incident-id-in-asc-order',
        })
        .silentRun())
  })

  describe('search incidents', () => {
    it('should dispatch search incidents success', () => {
      const q = 'Here be dragons'
      const action = { type: ORDERING_CHANGED }

      return expectSaga(searchIncidents, action)
        .provide([
          [select(makeSelectSearchQuery), q],
          [matchers.call.fn(authCall), incidentsJSON],
        ])
        .select(makeSelectSearchQuery)
        .put(applyFilterRefreshStop())
        .select(makeSelectFilterParams)
        .call.like(authCall, CONFIGURATION.SEARCH_ENDPOINT, { q })
        .not.put(push('/manage/incidents'))
        .put(searchIncidentsSuccess({ ...incidentsJSON, orderedAs: '' }))
        .run()
    })

    it('should dispatch success in case of a 500 error status', () => {
      const q = 'Here be dragons'
      const message = 'Internal server error'
      const error = new Error(message)
      error.response = {
        status: 500,
      }

      return expectSaga(searchIncidents, q)
        .provide([[matchers.call.fn(authCall), throwError(error)]])
        .select(makeSelectSearchQuery)
        .call.like(authCall)
        .put(push('/manage/incidents'))
        .put(searchIncidentsSuccess({ count: 0, results: [] }))
        .run()
    })

    it('should dispatch fetchIncidents error', () => {
      const q = 'Here be dragons'
      const message = '404 Not Found'
      const error = new Error(message)
      error.response = {
        status: 404,
      }

      return expectSaga(searchIncidents, q)
        .provide([[matchers.call.fn(authCall), throwError(error)]])
        .call.like(authCall)
        .put(searchIncidentsError(message))
        .run()
    })
  })

  describe('incident refresh', () => {
    it('should NOT refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
      }

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectActiveFilter), filter]])
        .select(makeSelectActiveFilter)
        .not.put(requestIncidents({ filter }))
        .silentRun(150)
    })

    it('should refresh incidents periodically', () => {
      const filter = {
        name: 'Foo bar baz',
        refresh: true,
      }

      return expectSaga(refreshIncidents, 100)
        .provide([[select(makeSelectActiveFilter), filter]])
        .select(makeSelectActiveFilter)
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .delay(100)
        .put(requestIncidents({ filter, page: undefined, sort: undefined }))
        .silentRun()
    })
  })

  describe('fetch districts', () => {
    it('should dispatch getDistrictsSuccess', () => {
      const districts = { results: [{ a: 1 }] }

      testSaga(fetchDistricts)
        .next()
        .call(authCall, CONFIGURATION.AREAS_ENDPOINT, {
          type_code: CONFIGURATION.areaTypeCodeForDistrict,
          page_size: 1000,
        })
        .next(districts)
        .put(getDistrictsSuccess(districts.results))
        .next()
        .isDone()
    })

    it('should dispatch getDistrictsFailed', () => {
      const message = '404 not found'
      const error = new Error(message)

      testSaga(fetchDistricts)
        .next()
        .call(authCall, CONFIGURATION.AREAS_ENDPOINT, {
          type_code: CONFIGURATION.areaTypeCodeForDistrict,
          page_size: 1000,
        })
        .throw(error)
        .put(getDistrictsFailed(message))
        .next()
        .isDone()
    })
  })

  describe('fetch filters', () => {
    it('should dispatch getFiltersSuccess', () => {
      const response = {
        results: [
          { a: 1, options: { option: 'option', area_code: ['123', '456'] } },
        ],
      }
      const filters = [
        { a: 1, options: { option: 'option', area: ['123', '456'] } },
      ]

      testSaga(fetchFilters)
        .next()
        .call(authCall, CONFIGURATION.FILTERS_ENDPOINT)
        .next(response)
        .put(getFiltersSuccess(filters))
        .next()
        .isDone()
    })

    it('should dispatch getFiltersFailed', () => {
      const message = '404 not found'
      const error = new Error(message)

      testSaga(fetchFilters)
        .next()
        .call(authCall, CONFIGURATION.FILTERS_ENDPOINT)
        .throw(error)
        .put(getFiltersFailed(message))
        .next()
        .isDone()
    })
  })

  describe('remove filter', () => {
    it('should dispatch removeFilterSuccess', () => {
      const id = 1000
      const action = { payload: id }

      testSaga(removeFilter, action)
        .next()
        .call(authDeleteCall, `${CONFIGURATION.FILTERS_ENDPOINT}${id}`)
        .next(id)
        .put(removeFilterSuccess(id))
        .next()
        .isDone()
    })

    it('should dispatch removeFilterFailed', () => {
      const id = 1000
      const action = { payload: id }
      const message = '404 not found'
      const error = new Error(message)

      testSaga(removeFilter, action)
        .next()
        .call(authDeleteCall, `${CONFIGURATION.FILTERS_ENDPOINT}${id}`)
        .throw(error)
        .put(removeFilterFailed(message))
        .next()
        .isDone()
    })
  })

  describe('doSaveFilter', () => {
    const filterData = {
      name: 'Name of my filter',
      options: {
        maincategory_slug: ['i', 'a', 'o', 'u'],
        address_text: 'Weesperstraat 113-117',
      },
    }

    const { name, options } = filterData

    const payload = filterData
    const payloadResponse = {
      ...payload,
      key: 'something',
    }
    const action = {
      type: SAVE_FILTER,
      payload,
    }

    it('should call endpoint with filter data', () => {
      testSaga(doSaveFilter, action)
        .next()
        .call(authPostCall, CONFIGURATION.FILTERS_ENDPOINT, { name, options })
        .next(payloadResponse)
        .put(filterSaveSuccess(payloadResponse))
        .next()
        .put(getFilters())
        .next()
        .isDone()
    })

    it('should dispatch success', () =>
      expectSaga(doSaveFilter, action)
        .provide([[matchers.call.fn(authPostCall), payloadResponse]])
        .put({
          type: SAVE_FILTER_SUCCESS,
          payload: payloadResponse,
        })
        .run())

    it('should dispatch failed', () =>
      expectSaga(doSaveFilter, {
        payload: { ...payload, name: undefined },
      })
        .put({
          type: SAVE_FILTER_FAILED,
          payload: 'No name supplied',
        })
        .run())

    it('catches anything', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 300,
      }

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed(error))
        .next()
        .isDone()
    })

    it('catches 400', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 400,
      }

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed('Invalid data supplied'))
        .next()
        .isDone()
    })

    it('catches 500', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 500,
      }

      testSaga(doSaveFilter, action)
        .next()
        .throw(error)
        .put(filterSaveFailed('Internal server error'))
        .next()
        .isDone()
    })
  })

  describe('doUpdateFilter', () => {
    const updatePayload = {
      id: 1234,
      name: 'Name of my filter',
      options: {
        maincategory_slug: ['i', 'a', 'o', 'u'],
        address_text: 'Weesperstraat 113-117',
      },
      refresh: true,
      show_on_overview: false,
    }
    const { name, id, refresh, options, show_on_overview } = updatePayload
    const payload = {
      name: 'New name of my filter',
      options: {
        maincategory_slug: ['i', 'a'],
      },
    }
    const action = {
      type: UPDATE_FILTER,
      payload,
    }

    it('should call endpoint with filter data', () => {
      testSaga(doUpdateFilter, { ...action, payload: updatePayload })
        .next()
        .call(authPatchCall, `${CONFIGURATION.FILTERS_ENDPOINT}${id}`, {
          name,
          refresh,
          options,
          show_on_overview,
        })
        .next(updatePayload)
        .put(filterUpdatedSuccess(updatePayload))
        .next()
        .put(getFilters())
        .next()
        .isDone()
    })

    it('should dispatch success', () => {
      const payloadResponse = { ...updatePayload, payload }
      return expectSaga(doUpdateFilter, action)
        .provide([[matchers.call.fn(authPatchCall), payloadResponse]])
        .put({
          type: UPDATE_FILTER_SUCCESS,
          payload: payloadResponse,
        })
        .run()
    })

    it('catches anything', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 300,
      }

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed(error))
        .next()
        .isDone()
    })

    it('catches 400', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 400,
      }

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed('Invalid data supplied'))
        .next()
        .isDone()
    })

    it('catches 500', () => {
      const error = new Error('Something bad happened')
      error.response = {
        status: 500,
      }

      testSaga(doUpdateFilter, action)
        .next()
        .throw(error)
        .put(filterUpdatedFailed('Internal server error'))
        .next()
        .isDone()
    })
  })

  describe('saveFilter', () => {
    it('should spawn doSaveFilter', () => {
      const payload = {
        name: 'Name of my filter',
        options: {
          maincategory_slug: ['i', 'a', 'o', 'u'],
          address_text: 'Weesperstraat 113-117',
        },
      }
      const action = {
        type: SAVE_FILTER,
        payload,
      }

      return expectSaga(saveFilter, action).spawn(doSaveFilter, action).run()
    })
  })

  describe('updateFilter', () => {
    it('should spawn doUpdateFilter', () => {
      const payload = {
        id: 1234,
        name: 'New name of my filter',
        options: {
          maincategory_slug: ['i', 'a'],
        },
      }
      const action = {
        type: UPDATE_FILTER,
        payload,
      }

      return expectSaga(updateFilter, action)
        .spawn(doUpdateFilter, action)
        .run()
    })
  })
})
