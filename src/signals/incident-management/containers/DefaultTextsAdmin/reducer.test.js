// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

import {
  FETCH_DEFAULT_TEXTS,
  FETCH_DEFAULT_TEXTS_SUCCESS,
  FETCH_DEFAULT_TEXTS_ERROR,
  STORE_DEFAULT_TEXTS,
  STORE_DEFAULT_TEXTS_SUCCESS,
  STORE_DEFAULT_TEXTS_ERROR,
  ORDER_DEFAULT_TEXTS,
} from './constants'
import defaultTextsAdminReducer, { initialState } from './reducer'

describe('defaultTextsAdminReducer', () => {
  const text1 = {
    title: 'Asbest',
    text: 'Er is asbest gevonden en dit zal binnen 3 werkdagen worden opgeruimd.',
  }
  const text2 = {
    title: 'Bbest',
    text: 'Er is bsbest gevonden en dit zal misschien binnen 3 eeuwen worden opgeruimd.',
  }
  const text3 = {
    title: 'Cbest',
    text: 'Er is csbest gevonden en dit zal misschien binnen 3 eeuwen worden opgeruimd.',
  }

  const defaultTexts = [text1]

  it('returns the initial state', () => {
    expect(defaultTextsAdminReducer(undefined, {})).toEqual(
      fromJS(initialState)
    )
  })

  it('should FETCH_DEFAULT_TEXTS', () => {
    const action = {
      type: FETCH_DEFAULT_TEXTS,
      payload: {
        category_url:
          'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
        state: 'm',
      },
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      categoryUrl:
        'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/afval/sub_categories/asbest-accu',
      state: 'm',
      loading: true,
      error: false,
    })
  })

  it('should FETCH_DEFAULT_TEXTS_SUCCESS', () => {
    const action = {
      type: FETCH_DEFAULT_TEXTS_SUCCESS,
      payload: defaultTexts,
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      defaultTexts,
      loading: false,
      error: false,
    })
  })

  it('should FETCH_DEFAULT_TEXTS_ERROR', () => {
    const action = {
      type: FETCH_DEFAULT_TEXTS_ERROR,
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      loading: false,
      error: true,
    })
  })

  it('should STORE_DEFAULT_TEXTS', () => {
    const action = {
      type: STORE_DEFAULT_TEXTS,
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      storing: true,
      error: false,
    })
  })

  it('should STORE_DEFAULT_TEXTS_SUCCESS', () => {
    const action = {
      type: STORE_DEFAULT_TEXTS_SUCCESS,
      payload: defaultTexts,
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      defaultTexts,
      storing: false,
      error: false,
    })
  })

  it('should STORE_DEFAULT_TEXTS_ERROR', () => {
    const action = {
      type: STORE_DEFAULT_TEXTS_ERROR,
    }
    expect(defaultTextsAdminReducer(fromJS({}), action).toJS()).toEqual({
      storing: false,
      error: true,
    })
  })

  it('should ORDER_DEFAULT_TEXTS up', () => {
    const action = {
      type: ORDER_DEFAULT_TEXTS,
      payload: {
        index: 2,
        type: 'up',
      },
    }
    expect(
      defaultTextsAdminReducer(
        fromJS({ defaultTexts: [text1, text2, text3] }),
        action
      ).toJS()
    ).toEqual({
      defaultTexts: [text1, text3, text2],
    })
  })

  it('should ORDER_DEFAULT_TEXTS down', () => {
    const action = {
      type: ORDER_DEFAULT_TEXTS,
      payload: {
        index: 1,
        type: 'down',
      },
    }
    expect(
      defaultTextsAdminReducer(
        fromJS({ defaultTexts: [text1, text2, text3] }),
        action
      ).toJS()
    ).toEqual({
      defaultTexts: [text1, text3, text2],
    })
  })
})
