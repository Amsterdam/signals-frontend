// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam

import { Map } from '@amsterdam/react-maps'
import { render } from '@testing-library/react'
import type L from 'leaflet'
import type { MapOptions } from 'leaflet'

import MAP_OPTIONS from 'shared/services/configuration/map-options'

import MarkerCluster from './MarkerCluster'

const options = {
  ...MAP_OPTIONS,
  maxZoom: 18,
} as MapOptions
const withMapContainer = (Component: JSX.Element) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
)

describe('signals/incident-management/containes/IncidentOverviewPage/components/MarkerCluster', () => {
  it('should render the cluster layer in the map', () => {
    const setInstanceMock = jest.fn()
    const { getByTestId } = render(
      withMapContainer(
        <MarkerCluster
          clusterOptions={{ test: 1 } as L.MarkerClusterGroupOptions}
          setInstance={setInstanceMock}
        />
      )
    )

    expect(getByTestId('map-test')).toBeInTheDocument()
    expect(setInstanceMock).toHaveBeenCalledTimes(1)
  })
  it('should make the MarkerCluster not accessible', () => {
    const setInstanceMock = jest.fn()
    const { container, rerender } = render(
      withMapContainer(<MarkerCluster setInstance={setInstanceMock} />)
    )

    expect(container.getElementsByClassName('marker-cluster')).toContain(
      'tabindex=0'
    )

    rerender(
      withMapContainer(
        <MarkerCluster keyboard={false} setInstance={setInstanceMock} />
      )
    )
    expect(container.getElementsByClassName('marker-cluster')).not.toContain(
      'tabindex=0'
    )
  })
})
