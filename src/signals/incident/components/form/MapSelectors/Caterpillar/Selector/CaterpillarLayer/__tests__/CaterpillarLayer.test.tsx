// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ReactNode } from 'react'

import type { FeatureCollection } from 'geojson'

import { render, screen } from '@testing-library/react'

import { Map } from '@amsterdam/react-maps'

import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import userEvent from '@testing-library/user-event'
import { WfsDataProvider } from '../../../../components/DataContext/context'
import CaterpillarLayer from '..'
import {
  contextValue,
  withSelectContext,
} from '../../../context/__tests__/context.test'

describe('CaterpillarLayer', () => {
  const withMapCaterpillar = (Component: ReactNode) => (
    <Map data-testid="map-test" options={MAP_OPTIONS}>
      {Component}
    </Map>
  )

  it('should render the caterpillar layer in the map', () => {
    const CaterpillarLayerWrapper = () => (
      <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
        <CaterpillarLayer />;
      </WfsDataProvider>
    )
    render(withSelectContext(withMapCaterpillar(<CaterpillarLayerWrapper />)))

    expect(
      screen.getByAltText('Eikenboom, is geselecteerd (308777)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Eikenboom, is gemeld (308779)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Eikenboom, is gemeld, is geselecteerd (308778)')
    ).toBeInTheDocument()

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })

  it('should handle selecting a tree', async () => {
    const CaterpillarLayerWrapper = () => (
      <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
        <CaterpillarLayer />;
      </WfsDataProvider>
    )
    const updateSpy = jest.fn()

    render(
      withSelectContext(withMapCaterpillar(<CaterpillarLayerWrapper />), {
        ...contextValue,
        update: updateSpy,
      })
    )

    const tree = screen.getByAltText('Eikenboom, is gemeld (308779)')
    userEvent.click(tree)

    expect(updateSpy).toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          id: 308779,
          isReported: true,
          description: 'Eikenboom',
          type: 'Eikenboom',
          GlobalID: '88fa2ec3-690d-44a8-b8d8-4c462c86ac74',
        },
      ])
    )
  })

  it('should handle deselecting a tree', () => {
    const CaterpillarLayerWrapper = () => (
      <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
        <CaterpillarLayer />;
      </WfsDataProvider>
    )
    const updateSpy = jest.fn()

    render(
      withSelectContext(withMapCaterpillar(<CaterpillarLayerWrapper />), {
        ...contextValue,
        update: updateSpy,
      })
    )

    const tree = screen.getByAltText(
      'Eikenboom, is gemeld, is geselecteerd (308778)'
    )
    userEvent.click(tree)

    expect(updateSpy).toHaveBeenCalled()
    expect(updateSpy).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        {
          description: 'Eikenboom',
          id: 308778,
          isReported: true,
          type: 'Eikenboom',
          GlobalID: '218b8c15-ef75-4851-9616-125132af7438',
        },
      ])
    )
  })
})
