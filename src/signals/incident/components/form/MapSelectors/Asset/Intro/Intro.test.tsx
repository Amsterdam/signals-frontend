// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'

import * as reactRedux from 'react-redux'
import type { AssetSelectValue } from '../types'
import { showMap } from '../../../../../containers/IncidentContainer/actions'
import type { Meta } from '../../types'

import { contextValue as assetSelectContextValue } from '../__tests__/withAssetSelectContext'
import Intro from '../Intro'
import MockInstance = jest.MockInstance

const contextValue: AssetSelectValue = {
  ...assetSelectContextValue,
  selection: undefined,
  meta: {} as Meta,
  coordinates: { lat: 0, lng: 0 },
}

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>{Component}</AssetSelectProvider>
  )

const dispatch = jest.fn()

describe('signals/incident/components/form/AssetSelect/Intro', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    const dispatchEventSpy: MockInstance<any, any> = jest.spyOn(
      global.document,
      'dispatchEvent'
    )

    dispatch.mockReset()
    dispatchEventSpy.mockReset()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('renders', () => {
    render(
      withContext(<Intro />, {
        ...contextValue,
        coordinates: { lat: 1, lng: 1 },
      })
    )

    expect(screen.getByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.getByTestId('mapLocation')).toBeInTheDocument()
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument()
  })

  it('should call edit', () => {
    render(withContext(<Intro />))

    expect(dispatch).not.toHaveBeenCalledWith(showMap())

    const element = screen.getByTestId('chooseOnMap')

    fireEvent.click(element)

    expect(dispatch).toHaveBeenCalledWith(showMap())
  })
})
