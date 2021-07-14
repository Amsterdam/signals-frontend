// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useMemo, useContext, useState } from 'react'
import type { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import type { MapOptions } from 'leaflet'

import { breakpoint, themeSpacing } from '@amsterdam/asc-ui'
import { MapPanel, MapPanelDrawer, MapPanelProvider } from '@amsterdam/arm-core'
import { SnapPoint } from '@amsterdam/arm-core/lib/components/MapPanel/constants'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import type { Variant } from '@amsterdam/arm-core/lib/components/MapPanel/MapPanelContext'

import Map from 'components/Map'
import MapCloseButton from 'components/MapCloseButton'
import MAP_OPTIONS from 'shared/services/configuration/map-options'

import useLayerVisible from '../../hooks/useLayerVisible'
import { MapMessage, ZoomMessage } from '../../components/MapMessage'
import CaterpillarSelectContext from '../context/context'
import ViewerContainer from '../../components/ViewerContainer'
import LegendToggleButton from '../../components/LegendToggleButton'
import LegendPanel from '../../components/LegendPanel'
import WfsLayer from '../WfsLayer'
import { getIconUrl } from '../utils'
import CaterpillarLayer from './CaterpillarLayer'
import SelectionPanel from './SelectionPanel'

const MAP_PANEL_DRAWER_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '90%',
  [SnapPoint.Halfway]: '50%',
  [SnapPoint.Full]: '0',
}
const MAP_PANEL_SNAP_POSITIONS = {
  [SnapPoint.Closed]: '30px',
  [SnapPoint.Halfway]: '400px',
  [SnapPoint.Full]: '100%',
}

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

const ButtonBarStyle = styled.div<{ messageVisible: boolean }>`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    margin-top: ${({ messageVisible }) => messageVisible && themeSpacing(11)};
  }
`

const ButtonBar: FunctionComponent<{ zoomLevel: ZoomLevel }> = ({
  children,
  zoomLevel,
}) => {
  const layerVisible = useLayerVisible(zoomLevel)
  const { message } = useContext(CaterpillarSelectContext)
  const messageVisible = !layerVisible || !!message

  return (
    <ButtonBarStyle data-testid="buttonBar" messageVisible={messageVisible}>
      {children}
    </ButtonBarStyle>
  )
}

export interface ButtonBarProps {
  zoomLevel: ZoomLevel
}

const Selector = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const { selection, location, meta, update, close, message } = useContext(
    CaterpillarSelectContext
  )

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })
  const { Panel, panelVariant } = useMemo<{
    Panel: FunctionComponent
    panelVariant: Variant
  }>(
    () =>
      desktopView
        ? { Panel: MapPanel, panelVariant: 'panel' }
        : { Panel: MapPanelDrawer, panelVariant: 'drawer' },
    [desktopView]
  )

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

  const [showLegendPanel, setShowLegendPanel] = useState(false)
  const [showSelectionPanel, setShowSelectionPanel] = useState(true)

  const legendPanelItems = useMemo(
    () =>
      meta.legendItems.map(({ iconId, label, id }) => ({
        id,
        label,
        iconUrl: getIconUrl(
          meta.icons.find((icon) => icon.id === iconId)?.icon
        ),
      })),
    [meta.legendItems, meta.icons]
  )

  const toggleLegend = () => setShowLegendPanel(() => !showLegendPanel)

  const handleLegendCloseButton = () => {
    setShowLegendPanel(false)
    setShowSelectionPanel(true)
  }

  const mapWrapper = (
    <Wrapper data-testid="caterpillarSelectSelector">
      <StyledMap hasZoomControls={desktopView} mapOptions={mapOptions}>
        <MapPanelProvider
          mapPanelSnapPositions={MAP_PANEL_SNAP_POSITIONS}
          mapPanelDrawerSnapPositions={MAP_PANEL_DRAWER_SNAP_POSITIONS}
          variant={panelVariant}
          initialPosition={SnapPoint.Halfway}
        >
          <ViewerContainer
            topLeft={
              <ButtonBar zoomLevel={MAP_CATERPILLAR_ZOOM_LEVEL}>
                <LegendToggleButton
                  onClick={toggleLegend}
                  isRenderingLegendPanel={showLegendPanel}
                />
              </ButtonBar>
            }
            topRight={
              <ButtonBar zoomLevel={MAP_CATERPILLAR_ZOOM_LEVEL}>
                <MapCloseButton onClick={close} />
              </ButtonBar>
            }
          />

          <Panel data-testid={`panel${desktopView ? 'Desktop' : 'Mobile'}`}>
            {showSelectionPanel && (
              <SelectionPanel
                featureTypes={meta.featureTypes}
                icons={meta.icons}
                selection={selection || []}
                variant={panelVariant}
                onChange={update}
                onClose={close}
              />
            )}

            {showLegendPanel && (
              <LegendPanel
                onClose={handleLegendCloseButton}
                variant={panelVariant}
                items={legendPanelItems}
              />
            )}
          </Panel>
        </MapPanelProvider>

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
