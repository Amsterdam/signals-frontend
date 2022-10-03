// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import type { Map as ImmutableMap } from 'immutable'
import type { AnyAction, Reducer } from 'redux'

import type CategoriesType from 'types/api/categories'

import type {
  CategoryActions,
  FetchCategoriesSuccessAction,
  FetchCategoriesFailedAction,
} from './actions'
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

type CategoriesReducer = Reducer<CategoriesState, CategoryActions | AnyAction>

const categoriesReducer: CategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORIES:
      return state.set('loading', true)

    case FETCH_CATEGORIES_FAILED: {
      const { payload } = action as FetchCategoriesFailedAction

      return state.set('loading', false).set('error', payload)
    }

    case FETCH_CATEGORIES_SUCCESS: {
      const { payload } = action as FetchCategoriesSuccessAction

      return state
        .set('loading', false)
        .set('error', null)
        .set('categories', fromJS(payload) as Categories)
    }

    default:
      return state
  }
}

export default categoriesReducer
