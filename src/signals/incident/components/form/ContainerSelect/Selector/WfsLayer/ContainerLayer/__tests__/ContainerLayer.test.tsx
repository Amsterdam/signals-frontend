// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ReactNode } from 'react'
import React from 'react'

import type { FeatureCollection } from 'geojson'
import type { MapOptions } from 'leaflet'

import { render, screen } from '@testing-library/react'

import { Map } from '@amsterdam/react-maps'

import containersJson from 'utils/__tests__/fixtures/containers.json'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import type { FeatureType } from 'signals/incident/components/form/ContainerSelect/types'
import { WfsDataProvider } from '../../context'
import ContainerLayer from '..'
import type { ClusterMarker } from '../ContainerLayer'
import { shouldSpiderfy, getMarkerByZoomLevel } from '../ContainerLayer'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options: MapOptions = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362],
  zoom: 14,
}

describe('getMarkerByZoomLevel', () => {
  const cluster = {
    __parent: { _zoom: 15, __parent: { _zoom: 14, __parent: { _zoom: 13 } } },
  } as ClusterMarker
  it('should return the right parent depending on the zoom level', () => {
    expect(getMarkerByZoomLevel(cluster, 14)).toEqual(cluster.__parent.__parent)
  })

  it('should return undefined when no parent found on the zoom level', () => {
    expect(getMarkerByZoomLevel(cluster, 12)).toBeUndefined()
  })
})

describe('shouldSpiderfy', () => {
  it('should spiderfy when maxZoom', () => {
    const cluster = ({
      _zoom: 14,
      _childCount: 3,
      _childClusters: [
        {
          _zoom: 15,
          _childCount: 3,
          _childClusters: [],
        },
      ],
    } as unknown) as ClusterMarker
    expect(shouldSpiderfy(cluster, 15)).toBeTruthy()
  })

  it('should not spiderfy when can zoomed', () => {
    const cluster = ({
      _zoom: 13,
      _childCount: 4,
      _childClusters: [
        {
          _zoom: 14,
          _childCount: 3,
          _childClusters: [
            {
              __zoom: 15,
              _childCount: 3,
              _childClusters: [],
            },
          ],
        },
      ],
    } as unknown) as ClusterMarker
    expect(shouldSpiderfy(cluster, 14)).toBeFalsy()
  })
})

describe('ContainerLayer', () => {
  const withMapContainer = (Component: ReactNode) => (
    <Map data-testid="map-test" options={options}>
      {Component}
    </Map>
  )

  const featureTypes: FeatureType[] = [
    {
      label: 'Papier',
      description: 'Papier container',
      icon: {
        options: {},
        iconSvg: 'iconSvg',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Papier',
    },
    {
      label: 'Glas',
      description: 'Glas container',
      icon: {
        options: {},
        iconSvg: 'svgIcon',
      },
      idField: 'id_nummer',
      typeField: 'fractie_omschrijving',
      typeValue: 'Glas',
    },
  ]

  it('should render the cluster layer in the map', () => {
    const ContainerLayerWrapper = () => (
      <WfsDataProvider value={containersJson as FeatureCollection}>
        <ContainerLayer featureTypes={featureTypes} desktopView />;
      </WfsDataProvider>
    )
    render(withMapContainer(<ContainerLayerWrapper />))

    expect(screen.getByTestId('map-test')).toBeInTheDocument()
  })
})
