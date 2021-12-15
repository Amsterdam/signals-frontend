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
import { featureTolocation } from 'shared/services/map-location'

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
  const setItemSpy = jest.fn()
  const withMapCaterpillar = () =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={caterpillarsJson as FeatureCollection}>
          <CaterpillarLayer />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, setItem: setItemSpy }
    )

  it('should render the caterpillar layer in the map', () => {
    render(withMapCaterpillar())
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
    const featureId = 308779
    const feature = caterpillarsJson.features.find(({ id }) => id === featureId)
    const coordinates = featureTolocation(feature?.geometry as Geometrie)

    render(withMapCaterpillar())

    const tree = screen.getByAltText(`Eikenboom, is gemeld (${featureId})`)

    userEvent.click(tree)

    expect(setItemSpy).toHaveBeenCalledWith({
      id: featureId,
      isReported: true,
      description: 'Eikenboom',
      type: 'Eikenboom',
      GlobalID: feature?.properties.GlobalID,
      location: {
        coordinates,
      },
    })
  })

  it('should handle deselecting a tree', () => {
    render(withMapCaterpillar())
    const tree = screen.getByAltText(
      'Eikenboom, is gemeld, is geselecteerd (308778)'
    )
    userEvent.click(tree)

    expect(setItemSpy).toHaveBeenCalled()
    expect(setItemSpy).not.toHaveBeenCalledWith({
      description: 'Eikenboom',
      id: 308778,
      isReported: true,
      type: 'Eikenboom',
      GlobalID: '218b8c15-ef75-4851-9616-125132af7438',
    })
  })
})
