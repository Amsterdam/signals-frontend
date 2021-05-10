// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { fromJS } from 'immutable'

import { initialState } from './reducer'
import makeSelectHistoryModel, { selectHistoryDomain } from './selectors'

describe('makeSelectHistoryModel', () => {
  const selector = makeSelectHistoryModel()

  it('should select the history', () => {
    const history = {
      foo: 'bar',
    }

    const mockedState = {
      history: fromJS(history),
    }

    expect(selector(mockedState)).toEqual(history)
  })

  it('should return the initial state', () => {
    expect(selectHistoryDomain(fromJS({}))).toEqual(initialState)
  })
})
