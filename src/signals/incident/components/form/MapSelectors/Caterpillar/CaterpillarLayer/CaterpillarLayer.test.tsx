// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import type { FeatureCollection } from 'geojson'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Geometrie } from 'types/incident'

import caterpillarsJson from 'utils/__tests__/fixtures/caterpillars.json'
import { meta, selection } from 'utils/__tests__/fixtures/caterpillarsSelection'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import userEvent from '@testing-library/user-event'

import { WfsDataProvider } from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import { featureToCoordinates } from 'shared/services/map-location'

import withAssetSelectContext, {
  contextValue,
} from '../../Asset/__tests__/withAssetSelectContext'
import CaterpillarLayer from '.'

const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: selection[0],
  meta,
}

describe('CaterpillarLayer', () => {
  const setItem = jest.fn()
  const removeItem = jest.fn()

  const withMapCaterpillar = (contextOverride = {}) =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
          <CaterpillarLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, setItem, removeItem, ...contextOverride }
    )

  afterEach(() => {
    setItem.mockReset()
    removeItem.mockReset()
  })

  it('should render the caterpillar layer in the map', () => {
    render(withMapCaterpillar())
    expect(
      screen.getByAltText('Eikenboom, is geselecteerd (308777)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Eikenboom, is gemeld (308779)')
    ).toBeInTheDocument()

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })

  it('should handle selecting a tree', async () => {
    const featureId = 308779
    const feature = caterpillarsJson.features.find(({ id }) => id === featureId)
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

    const { rerender } = render(withMapCaterpillar())

    const tree = screen.getByAltText(`Eikenboom, is gemeld (${featureId})`)

    userEvent.click(tree)

    expect(setItem).toHaveBeenCalledWith({
      id: featureId,
      isReported: true,
      description: 'Eikenboom',
      type: 'Eikenboom',
      GlobalID: feature?.properties.GlobalID,
      location: {
        coordinates,
      },
      label: `Eikenboom - ${featureId}`,
    })

    expect(
      screen.queryByAltText(
        `Eikenboom, is gemeld, is geselecteerd (${featureId})`
      )
    ).not.toBeInTheDocument()

    rerender(
      withMapCaterpillar({
        selection: selection.find(({ id }) => id === featureId),
      })
    )

    expect(
      screen.getByAltText(
        `Eikenboom, is gemeld, is geselecteerd (${featureId})`
      )
    ).toBeInTheDocument()
  })

  it('should handle deselecting a tree', () => {
    const featureId = 308778
    const selected = selection.find(({ id }) => id === featureId)

    render(
      withMapCaterpillar({
        selection: selected,
      })
    )

    const tree = screen.getByAltText(
      `Eikenboom, is gemeld, is geselecteerd (${308778})`
    )

    userEvent.click(tree)

    expect(removeItem).toHaveBeenCalled()
    expect(setItem).not.toHaveBeenCalled()
  })
})
