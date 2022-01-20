// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import { Map } from '@amsterdam/react-maps'

import type { FeatureCollection } from 'geojson'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'

import containerJson from 'utils/__tests__/fixtures/assets.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import type { Geometrie } from 'types/incident'
import userEvent from '@testing-library/user-event'
import { featureToCoordinates } from 'shared/services/map-location'
import { WfsDataProvider } from '../context'

import AssetLayer from '.'

const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: {
    description: 'Glas container',
    id: 'GLB00072',
    type: 'Glas',
    location: {},
    label: 'Glas container - GLB00072',
  },
}

const { featureTypes } = contextValue.meta

describe('AssetLayer', () => {
  const setItem = jest.fn()
  const removeItem = jest.fn()

  const withAssetMap = (contextOverride = {}) =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={containerJson as FeatureCollection}>
          <AssetLayer featureTypes={featureTypes} />
        </WfsDataProvider>
      </Map>,
      { ...assetSelectProviderValue, setItem, removeItem, ...contextOverride }
    )

  afterEach(() => {
    setItem.mockReset()
    removeItem.mockReset()
  })

  it('should render the asset layer in the map', () => {
    render(withAssetMap())
    expect(
      screen.getByAltText('Papier container (PAB00022)')
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Glas container, is geselecteerd (GLB00072)')
    ).toBeInTheDocument()

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })

  it('should handle selecting a container', async () => {
    const featureId = 'PAB00022'
    const feature = containerJson.features.find(
      ({ properties }) => properties.id_nummer === featureId
    )
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)
    const newSelection = {
      id: featureId,
      isReported: false,
      description: 'Papier container',
      type: 'Papier',
      label: 'Papier container - PAB00022',
      location: {
        coordinates: coordinates,
      },
    }

    render(withAssetMap())

    const container = screen.getByAltText(`Papier container (${featureId})`)

    userEvent.click(container)

    expect(
      screen.queryByAltText(`Papier container, is geselecteerd (${featureId})`)
    ).not.toBeInTheDocument()

    render(withAssetMap({ selection: newSelection }))

    expect(
      screen.queryByAltText(`Papier container, is geselecteerd (${featureId})`)
    ).toBeInTheDocument()
  })
})
