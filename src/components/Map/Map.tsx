// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import type { FC, PropsWithChildren } from 'react'
import styled from 'styled-components'
import { Zoom, Map as MapComponent } from '@amsterdam/arm-core'
import { TileLayer } from '@amsterdam/react-maps'

import type { LeafletEventHandlerFnMap, MapOptions } from 'leaflet'

import ViewerContainer from 'components/ViewerContainer'
import configuration from 'shared/services/configuration/configuration'

const StyledMap = styled(MapComponent)`
  cursor: default;

  &:focus {
    outline: 5px auto Highlight !important; // Firefox outline
    outline: 5px auto -webkit-focus-ring-color !important; // Safari / Chrome outline
  }

  &.leaflet-drag-target {
    cursor: all-scroll;
  }
`

const StyledViewerContainer = styled(ViewerContainer)`
  z-index: 0;
`

export interface MapProps {
  className?: string
  'data-testid'?: string
  /**
   * Map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events?: LeafletEventHandlerFnMap
  hasGPSControl?: boolean
  hasZoomControls?: boolean
  /**
   * Leaflet configuration options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: MapOptions
  fullScreen?: boolean
  /**
   * useState function that sets a reference to the map instance
   */
  setInstance?: (instance: L.Map) => void
}

const Map: FC<PropsWithChildren<MapProps>> = ({
  'data-testid': dataTestId = 'map-base',
  children,
  className = '',
  events,
  fullScreen = false,
  hasZoomControls = false,
  mapOptions,
  setInstance,
}) => {
  const hasTouchCapabilities = 'ontouchstart' in window
  const showZoom = hasZoomControls && !hasTouchCapabilities
  const maxZoom = mapOptions.maxZoom || configuration.map.options.maxZoom
  const minZoom = mapOptions.minZoom || configuration.map.options.minZoom
  const { center } = mapOptions
  const options = {
    maxZoom,
    minZoom,
    tap: false,
    scrollWheelZoom: false,
    center,
    ...mapOptions,
  }

  return (
    <StyledMap
      // Disabling linter; without className prop, the Map component cannot be styled
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      className={className}
      data-testid={dataTestId}
      data-max-zoom={maxZoom}
      data-min-zoom={minZoom}
      events={events}
      options={options}
      fullScreen={fullScreen}
      setInstance={setInstance}
    >
      {children}

      {/* Render zoom buttons after children to maintain correct focus order */}
      <StyledViewerContainer
        bottomRight={
          showZoom && (
            <div data-testid="mapZoom">
              <Zoom />
            </div>
          )
        }
      />

      <TileLayer
        args={configuration.map.tiles.args as [string]}
        options={configuration.map.tiles.options}
      />
    </StyledMap>
  )
}

export default Map
