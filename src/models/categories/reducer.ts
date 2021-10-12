// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

import type { Immutable } from 'types'
import type { Reducer } from 'redux'
import type Categories from 'types/api/categories'
import type { CategoryActions } from './actions'

import {
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES,
} from './constants'

export interface CategoriesState {
  loading: boolean
  error: Error | null
  categories: Categories | null
}

export const initialState = fromJS({
  loading: false,
  error: null,
  categories: null,
}) as Immutable<CategoriesState>

type CategoriesReducer = Reducer<Immutable<CategoriesState>, CategoryActions>

const categoriesReducer: CategoriesReducer = (
  state: Immutable<CategoriesState> = initialState,
  action
) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return state.set('loading', true)

    case FETCH_CATEGORIES_FAILED:
      return state.set('loading', false).set('error', fromJS(action.payload))

    case FETCH_CATEGORIES_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('categories', fromJS(action.payload))

    default:
      return state
  }
}

export default categoriesReducer
