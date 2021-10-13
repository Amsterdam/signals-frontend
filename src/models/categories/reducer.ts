// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

import type { Map as ImmutableMap } from 'immutable'
import type { Reducer } from 'redux'
import type CategoriesType from 'types/api/categories'
import type { CategoryActions } from './actions'

import {
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES,
} from './constants'

export type Categories = ImmutableMap<
  keyof CategoriesType,
  CategoriesType[keyof CategoriesType]
>

interface State {
  loading: boolean
  error: Error | null
  categories: Categories | null
}

export type CategoriesState = ImmutableMap<keyof State, State[keyof State]>

export const initialState = fromJS({
  loading: false,
  error: null,
  categories: null,
}) as CategoriesState

type CategoriesReducer = Reducer<CategoriesState, CategoryActions>

const categoriesReducer: CategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return state.set('loading', true)

    case FETCH_CATEGORIES_FAILED:
      return state.set('loading', false).set('error', action.payload)

    case FETCH_CATEGORIES_SUCCESS:
      return state
        .set('loading', false)
        .set('error', null)
        .set('categories', fromJS(action.payload) as Categories)

    default:
      debugger
      return state
  }
}

export default categoriesReducer
