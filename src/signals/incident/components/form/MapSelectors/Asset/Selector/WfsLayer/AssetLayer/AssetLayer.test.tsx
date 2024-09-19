// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { Map } from '@amsterdam/react-maps'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FeatureCollection } from 'geojson'
import { mocked } from 'jest-mock'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { featureToCoordinates } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import withAssetSelectContext, {
  contextValue,
} from 'signals/incident/components/form/MapSelectors/Asset/__tests__/withAssetSelectContext'
import type { AssetSelectValue } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Geometrie } from 'types/incident'
import containerJson from 'utils/__tests__/fixtures/assets.json'

import AssetLayer from './index'
import { WfsDataProvider } from '../context'

const assetSelectProviderValue: AssetSelectValue = {
  ...contextValue,
  selection: [
    {
      description: 'Glas container',
      id: 'GLB00072',
      type: 'Glas',
      location: {},
      label: 'Glas container - GLB00072',
    },
  ],
}

const mockLatLng = { lat: 10, lng: 20 }
const mockAddress = {
  postcode: '1000 AA',
  huisnummer: '100',
  woonplaats: 'Amsterdam',
  openbare_ruimte: 'West',
}
const geocodedResponse = {
  id: 'foo',
  value: 'bar',
  data: {
    location: mockLatLng,
    address: mockAddress,
  },
}

jest.mock('shared/services/reverse-geocoder')

const { featureTypes } = contextValue.meta

describe('AssetLayer', () => {
  const setItem = jest.fn()
  const removeItem = jest.fn()

  const withAssetMap = (contextOverride = {}) =>
    withAssetSelectContext(
      <Map data-testid="map-test" options={MAP_OPTIONS}>
        <WfsDataProvider value={containerJson as FeatureCollection}>
          <AssetLayer />
        </WfsDataProvider>
      </Map>,
      {
        ...assetSelectProviderValue,
        setItem,
        removeItem,
        meta: {
          ...contextValue.meta,
          featureTypes,
        },
        ...contextOverride,
      }
    )

  afterEach(() => {
    setItem.mockReset()
    removeItem.mockReset()
  })

  const featureId = 'PAB00022'
  const feature = containerJson.features.find(
    ({ properties }) => properties.id_nummer === featureId
  )
  const coordinates = featureToCoordinates(feature?.geometry as Geometrie)
  const newSelection = [
    {
      id: featureId,
      isReported: false,
      description: 'Papier container',
      type: 'Papier',
      label: 'Papier container - PAB00022',
      location: {
        coordinates: coordinates,
      },
    },
  ]

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
    mocked(reverseGeocoderService).mockImplementation(() =>
      Promise.resolve(geocodedResponse)
    )
    const coordinates = {
      lat: 52.3731455533363,
      lng: 4.87999327142592,
    }

    const item = {
      id: 'PAB00022',
      type: 'Papier',
      description: 'Papier container',
      label: 'Papier container - PAB00022',
      status: undefined,
      coordinates,
    }

    render(withAssetMap())

    const container = screen.getByAltText(`Papier container (${featureId})`)

    userEvent.click(container)

    expect(reverseGeocoderService).toHaveBeenCalledWith(coordinates)
    expect(setItem).toHaveBeenCalledWith(item, { coordinates: coordinates })

    expect(
      screen.queryByAltText(`Papier container, is geselecteerd (${featureId})`)
    ).not.toBeInTheDocument()

    render(withAssetMap({ selection: newSelection }))

    expect(
      screen.queryByAltText(`Papier container, is geselecteerd (${featureId})`)
    ).toBeInTheDocument()
  })

  it('should handle deselecting a container with keyboard', async () => {
    render(withAssetMap({ selection: newSelection }))

    const container = screen.getByAltText(
      `Papier container, is geselecteerd (${featureId})`
    )

    container.focus()

    userEvent.keyboard('{Enter}')

    expect(removeItem).toHaveBeenCalled()
    expect(setItem).not.toHaveBeenCalled()
  })

  it('To render icons in the asset layer in the correct location, corresponding featureTypes should have an iconSize', () => {
    const iconSize = featureTypes[0].icon?.options?.iconSize
    expect(iconSize).toBeDefined()
  })

  it('should render template strings correctly', () => {
    render(
      withAssetMap({
        meta: {
          ...contextValue.meta,
          featureTypes: [
            {
              label: 'Papier',
              description: 'Papier met nummer: PAB00022',
              icon: {
                options: [Object],
                iconUrl: '/assets/images/afval/paper.svg',
              },
              idField: 'id_nummer',
              typeField: 'fractie_omschrijving',
              typeValue: 'Papier',
            },
          ],
        },
      })
    )

    const container = screen.getByAltText(
      `Papier met nummer: ${featureId} (${featureId})`
    )
    userEvent.click(container)

    const item = {
      id: 'PAB00022',
      type: 'Papier',
      description: 'Papier met nummer: PAB00022',
      label: 'Papier met nummer: PAB00022 - PAB00022',
      status: undefined,
      coordinates,
    }

    expect(setItem).toHaveBeenCalledWith(item, { coordinates: coordinates })
  })
})
