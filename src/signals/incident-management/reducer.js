// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

import { SET_SEARCH_QUERY, RESET_SEARCH_QUERY } from 'containers/App/constants'

import {
  GET_DISTRICTS_FAILED,
  GET_DISTRICTS_SUCCESS,
  APPLY_FILTER,
  CLEAR_FILTERS,
  CLEAR_EDIT_FILTER,
  EDIT_FILTER,
  FILTER_EDIT_CANCELED,
  GET_FILTERS_FAILED,
  GET_FILTERS_SUCCESS,
  ORDERING_CHANGED,
  PAGE_CHANGED,
  REMOVE_FILTER_SUCCESS,
  REQUEST_INCIDENTS_ERROR,
  REQUEST_INCIDENTS_SUCCESS,
  SAVE_FILTER_FAILED,
  SAVE_FILTER_SUCCESS,
  SEARCH_INCIDENTS_ERROR,
  SEARCH_INCIDENTS_SUCCESS,
  REQUEST_INCIDENTS,
  UPDATE_FILTER_FAILED,
  UPDATE_FILTER_SUCCESS,
} from './constants'

export const initialState = fromJS({
  activeFilter: {
    // filter settings for the list of incidents
    name: '',
    options: {},
  },
  districts: [],
  editFilter: {
    // settings selected for editing
    name: '',
    options: {},
  },
  filters: [],
  incidents: {
    count: undefined,
    results: [],
    orderedAs: '', //ordering of results
  },
  loading: false,
  loadingDistricts: false,
  loadingFilters: false,
  loadingIncidents: false,
  ordering: '', //ordering as user wants, may have failed. Old ordering still available in incidients.orderedAs

  page: 1,
})

const updateLoading = (state) =>
  state.set(
    'loading',
    state.get('loadingDistricts') ||
      state.get('loadingFilters') ||
      state.get('loadingIncidents')
  )

export default (state = initialState, action) => {
  let newFilters
  let re

  switch (action.type) {
    case GET_DISTRICTS_SUCCESS:
      return updateLoading(
        state
          .set('districts', fromJS(action.payload))
          .set('loadingDistricts', false)
      )

    case GET_DISTRICTS_FAILED:
      return updateLoading(
        state
          .set('loadingDistricts', false)
          .set('error', true)
          .set('errorMessage', action.payload)
      )

    case GET_FILTERS_SUCCESS:
      return updateLoading(
        state
          .set('filters', fromJS(action.payload))
          .set('loadingFilters', false)
      )

    case REMOVE_FILTER_SUCCESS:
      re = new RegExp(`/${action.payload}`, 'g')
      newFilters = state
        .get('filters')
        .toJS()
        .filter((i) => !i._links.self.href.match(re))
      return state.set('filters', fromJS(newFilters))

    case APPLY_FILTER:
      return state
        .set('activeFilter', fromJS(action.payload))
        .set('editFilter', fromJS(action.payload))
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'))
        .set('loadingIncidents', true)

    case CLEAR_FILTERS:
      return state
        .set('activeFilter', initialState.get('activeFilter'))
        .set('editFilter', initialState.get('editFilter'))
        .set('page', initialState.get('page'))
        .set('loadingIncidents', true)

    case EDIT_FILTER:
      return state.set('editFilter', fromJS(action.payload))

    case GET_FILTERS_FAILED:
    case SAVE_FILTER_FAILED:
    case UPDATE_FILTER_FAILED:
      return updateLoading(
        state
          .set('loadingFilters', false)
          .set('error', true)
          .set('errorMessage', action.payload)
      )

    case UPDATE_FILTER_SUCCESS: {
      const filterIndex = state
        .get('filters')
        .toJS()
        .findIndex(({ id }) => id === action.payload.id)

      return updateLoading(
        state
          .setIn(['filters', filterIndex], fromJS(action.payload))
          .set('error', false)
          .set('errorMessage', undefined)
          .set('loadingFilters', false)
      )
    }

    case SAVE_FILTER_SUCCESS:
      return updateLoading(
        state
          .set('activeFilter', fromJS(action.payload))
          .set('error', false)
          .set('errorMessage', undefined)
          .set('loadingFilters', false)
      )

    case CLEAR_EDIT_FILTER:
      return updateLoading(
        state
          .set('editFilter', initialState.get('editFilter'))
          .set('error', false)
          .set('errorMessage', undefined)
          .set('loadingFilters', false)
      )

    case FILTER_EDIT_CANCELED:
      return state.set('editFilter', state.get('activeFilter'))

    case PAGE_CHANGED:
      return state.set('page', action.payload).set('loadingIncidents', true)

    case ORDERING_CHANGED:
      return state
        .set('page', initialState.get('page'))
        .set('ordering', action.payload)
        .set('loadingIncidents', true)

    case REQUEST_INCIDENTS:
      return state
        .set('loadingIncidents', true)
        .set('error', false)
        .set('errorMessage', undefined)

    case SEARCH_INCIDENTS_SUCCESS:
    case REQUEST_INCIDENTS_SUCCESS:
      return state
        .set('incidents', fromJS(action.payload))
        .set('loadingIncidents', false)
        .set('error', false)
        .set('errorMessage', undefined)

    case SEARCH_INCIDENTS_ERROR:
    case REQUEST_INCIDENTS_ERROR:
      return state
        .set('error', true)
        .set('errorMessage', action.payload)
        .set('loadingIncidents', false)

    case SET_SEARCH_QUERY:
      return state
        .set('activeFilter', initialState.get('activeFilter'))
        .set('editFilter', initialState.get('editFilter'))
        .set('ordering', initialState.get('ordering'))
        .set('loading', true)
        .set('loadingIncidents', true)
        .set('page', initialState.get('page'))

    case RESET_SEARCH_QUERY:
      return state
        .set('loading', true)
        .set('ordering', initialState.get('ordering'))
        .set('page', initialState.get('page'))
        .set('loadingIncidents', true)

    default:
      return state
  }
}
