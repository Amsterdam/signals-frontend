// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'
import categoriesJson from 'utils/__tests__/fixtures/categories_private.json'

import type { CategoriesState } from './reducer'

import reducer, { initialState } from './reducer'
import { fetchCategories, fetchCategoriesSuccess, fetchCategoriesFailed } from './actions'

const catCount = 9

const intermediateState = fromJS({
  error: null,
  categories: {
    ...categoriesJson,
    results: categoriesJson.results.slice(0, catCount),
  },
  loading: false,
}) as CategoriesState

describe('models/categories/reducer', () => {
  test('default', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  test('FETCH_CATEGORIES', () => {
    const action = fetchCategories()

    expect(reducer(initialState, action)).toEqual(
      initialState.set('loading', true)
    )

    expect(reducer(intermediateState, action)).toEqual(
      intermediateState.set('loading', true)
    )
  })

  test('FETCH_CATEGORIES_SUCCESS', () => {
    const action = fetchCategoriesSuccess(categoriesJson)

    const result = fromJS({
      error: null,
      categories: action.payload,
      loading: false,
    })

    expect(reducer(initialState, action)).toEqual(result)
    expect(reducer(intermediateState, action)).toEqual(result)
  })

  test('FETCH_CATEGORIES_FAILED', () => {
    const error = new Error('Wrong!!!1!')
    const action = fetchCategoriesFailed(error)

    expect(reducer(initialState, action)).toEqual(
      initialState.set('error', error).set('loading', false)
    )

    expect(reducer(intermediateState, action)).toEqual(
      intermediateState.set('error', error).set('loading', false)
    )
  })
})
