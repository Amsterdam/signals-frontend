// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import reducer, { initialState } from '../reducer'
import { SET_USER_FILTERS } from '../constants'

describe('signals/settings/reducer', () => {
  it('should return the state', () => {
    expect(reducer(initialState, {})).toEqual(initialState)
  })

  it('should handle setting user filters', () => {
    const intermediateState = {
      users: {
        filters: {
          someProp: 'foo',
        },
      },
    }

    const action = {
      type: SET_USER_FILTERS,
      payload: {
        username: 'bar baz',
      },
    }

    expect(reducer(initialState, action)).toEqual({
      users: {
        filters: action.payload,
      },
    })

    expect(reducer(intermediateState, action)).toEqual({
      users: {
        filters: {
          someProp: 'foo',
          username: 'bar baz',
        },
      },
    })
  })
})
