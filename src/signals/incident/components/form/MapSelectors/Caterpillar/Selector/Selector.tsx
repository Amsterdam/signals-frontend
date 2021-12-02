// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useMemo, useContext } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import type { MapOptions } from 'leaflet'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'

import Map from 'components/Map'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import { MapMessage, ZoomMessage } from '../../components/MapMessage'
import CaterpillarSelectContext from '../context/context'
import WfsLayer from '../WfsLayer'
import CaterpillarLayer from './CaterpillarLayer'

const MAP_CATERPILLAR_ZOOM_LEVEL: ZoomLevel = {
  max: 12,
}

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box; // Override box-sizing: content-box set by Leaflet
  z-index: 3; // Render on top of header (logged-in)
`

const StyledMap = styled(Map)`
  height: 100%;
  width: 100%;
`

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const { location, message } = useContext(CaterpillarSelectContext)

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const mapOptions = useMemo<MapOptions>(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    () => ({
      ...MAP_OPTIONS,
      center: location,
      dragging: true,
      zoomControl: false,
      minZoom: 10,
      maxZoom: 16,
      zoom: 14,
    }),
    [location]
  )

  const mapWrapper = (
    <Wrapper data-testid="caterpillarSelectSelector">
      <StyledMap hasZoomControls={desktopView} mapOptions={mapOptions}>
        <MapMessage message={message} />
        <ZoomMessage zoomLevel={MAP_CATERPILLAR_ZOOM_LEVEL}>
          Zoom in om de objecten te zien
        </ZoomMessage>

        <WfsLayer zoomLevel={MAP_CATERPILLAR_ZOOM_LEVEL}>
          <CaterpillarLayer />
        </WfsLayer>
      </StyledMap>
    </Wrapper>
  )

  return ReactDOM.createPortal(mapWrapper, appHtmlElement)
}

export default Selector
