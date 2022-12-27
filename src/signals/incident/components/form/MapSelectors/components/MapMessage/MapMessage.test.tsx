// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2022 Gemeente Amsterdam
import type { ReactNode } from 'react'

import { Map } from '@amsterdam/react-maps'
import { render, screen } from '@testing-library/react'
import type { LatLngTuple } from 'leaflet'

import MAP_OPTIONS from 'shared/services/configuration/map-options'

import { ZoomMessage } from '.'
import * as useLayerVisible from '../../hooks/useLayerVisible'
import { MapMessage } from './MapMessage'

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const options = {
  ...MAP_OPTIONS,
  center: [52.37309068742423, 4.879893985747362] as LatLngTuple,
  zoom: 14,
}

const withMap = (Component: ReactNode) => (
  <Map data-testid="map-test" options={options}>
    {Component}
  </Map>
)

describe('ZoomMessage', () => {
  const props = { zoomLevel: { max: 12 } }

  it('should render the message in the map', () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => false)
    render(withMap(<ZoomMessage {...props} />))

    expect(screen.getByTestId('zoom-message')).toBeInTheDocument()
  })

  it('should NOT render the message in the map', () => {
    jest.spyOn(useLayerVisible, 'default').mockImplementation(() => true)
    render(withMap(<ZoomMessage {...props} />))

    expect(screen.queryByTestId('zoom-message')).not.toBeInTheDocument()
  })
})

describe('MapMessage', () => {
  it('should render the message in the map', () => {
    const onClick = jest.fn()
    render(<MapMessage onClick={onClick}>the-message</MapMessage>)

    expect(screen.getByTestId('map-message')).toBeInTheDocument()
    expect(screen.getByText('the-message')).toBeInTheDocument()
  })
})
