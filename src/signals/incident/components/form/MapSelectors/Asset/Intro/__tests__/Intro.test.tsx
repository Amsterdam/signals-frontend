// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { fireEvent, render, screen } from '@testing-library/react'
import { withAppContext } from 'test/utils'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'

import type { AssetSelectValue, Meta } from '../../types'

import Intro from '../Intro'

const contextValue: AssetSelectValue = {
  selection: [],
  meta: {} as Meta,
  location: [0, 0],
  update: jest.fn(),
  edit: jest.fn(),
  close: jest.fn(),
  setMessage: jest.fn(),
  setLocation: jest.fn(),
}

export const withContext = (Component: JSX.Element, context = contextValue) =>
  withAppContext(
    <AssetSelectProvider value={context}>{Component}</AssetSelectProvider>
  )

describe('signals/incident/components/form/AssetSelect/Intro', () => {
  beforeEach(() => {})

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component without the map', () => {
    render(withContext(<Intro />))

    expect(screen.getByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.queryByTestId('mapLocation')).not.toBeInTheDocument()
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument()
  })

  it('should render the component with the map', () => {
    render(withContext(<Intro />, { ...contextValue, location: [1, 1] }))

    expect(screen.getByTestId('assetSelectIntro')).toBeInTheDocument()
    expect(screen.getByTestId('mapLocation')).toBeInTheDocument()
    expect(screen.getByTestId('chooseOnMap')).toBeInTheDocument()
  })

  it('should call edit', () => {
    render(withContext(<Intro />))
    expect(contextValue.edit).not.toHaveBeenCalled()

    const element = screen.getByTestId('chooseOnMap')
    fireEvent.click(element)
    expect(contextValue.edit).toHaveBeenCalled()
  })
})
