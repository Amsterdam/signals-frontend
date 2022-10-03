// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useContext, useEffect } from 'react'

import { render } from '@testing-library/react'

import MapContext from '..'
import { setValuesAction } from '../actions'
import Context from '../context'
import { initialState } from '../reducer'

describe('containers/MapContext/index', () => {
  const testLocation = { lat: 42, lng: 4 }
  const TestComponent = ({ value }) => {
    const { state, dispatch } = useContext(Context)

    useEffect(() => {
      if (value) dispatch(setValuesAction(value))
    }, [value, dispatch])

    return JSON.stringify(state)
  }

  it('should render the test component', () => {
    const testValue = JSON.stringify(initialState)
    const { queryByText, rerender } = render(
      <MapContext>
        <TestComponent />
      </MapContext>
    )

    expect(queryByText(testValue)).toBeInTheDocument()

    const rerenderTestValue = JSON.stringify({
      ...initialState,
      location: testLocation,
    })

    rerender(
      <MapContext>
        <TestComponent value={{ location: testLocation }} />
      </MapContext>
    )

    expect(queryByText(rerenderTestValue)).toBeInTheDocument()
  })
})
