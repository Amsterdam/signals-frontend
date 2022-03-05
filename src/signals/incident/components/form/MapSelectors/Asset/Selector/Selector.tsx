// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react'
import ReactDOM from 'react-dom'
import { Marker } from '@amsterdam/react-maps'
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import type { ReactElement, FC } from 'react'
import type {
  MapOptions,
  LeafletMouseEvent,
  Marker as MarkerType,
  Map as MapType,
  LatLngTuple,
  LatLngLiteral,
} from 'leaflet'
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import type { LocationResult } from 'types/location'

import useDelayedDoubleClick from 'hooks/useDelayedDoubleClick'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { markerIcon } from 'shared/services/configuration/map-markers'
import configuration from 'shared/services/configuration/configuration'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import MapCloseButton from 'components/MapCloseButton'
import GPSButton from 'components/GPSButton'

import LocationMarker from 'components/LocationMarker'
import { selectionIsUndetermined } from '../../constants'
import { MapMessage, ZoomMessage } from '../../components/MapMessage'
import AssetLayer from './WfsLayer/AssetLayer'
import WfsLayer from './WfsLayer'
import {
  StyledMap,
  StyledViewerContainer,
  TopLeftWrapper,
  Wrapper,
} from './styled'
import DetailPanel from './DetailPanel'

const MAP_CONTAINER_ZOOM_LEVEL: ZoomLevel = {
  max: 13,
}

export const MAP_LOCATION_ZOOM = 14

const Selector: FC = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const {
    close,
    coordinates,
    layer,
    meta,
    selection,
    setLocation,
    fetchLocation,
  } = useContext(AssetSelectContext)
  const [desktopView] = useMatchMedia({ minBreakpoint: 'laptop' })
  const center =
    coordinates || (configuration.map.options.center as LatLngTuple)

  const mapOptions: MapOptions = useMemo(
    () => ({
      minZoom: 7,
      maxZoom: 16,
      ...MAP_OPTIONS,
      center,
      dragging: true,
      zoomControl: false,
      scrollWheelZoom: true,
      zoom: coordinates
        ? Math.min(
            MAP_LOCATION_ZOOM,
            MAP_OPTIONS.maxZoom || Number.POSITIVE_INFINITY
          )
        : MAP_OPTIONS.zoom,
    }),
    [center, coordinates]
  )

  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [pinMarker, setPinMarker] = useState<MarkerType>()
  const [map, setMap] = useState<MapType>()
  const [geolocation, setGeolocation] = useState<LocationResult>()
  const hasFeatureTypes = meta.featureTypes.length > 0

  const showMarker =
    coordinates && (!selection || selectionIsUndetermined(selection))

  const mapClick = useCallback(
    ({ latlng }: LeafletMouseEvent) => {
      fetchLocation(latlng)
    },
    [fetchLocation]
  )

  const { click, doubleClick } = useDelayedDoubleClick(mapClick)

  const Layer = layer || AssetLayer

  useEffect(() => {
    if (!map || !pinMarker || !coordinates || selection) return

    pinMarker.setLatLng(coordinates)
  }, [map, coordinates, pinMarker, selection])

  useLayoutEffect(() => {
    if (!map || !geolocation) return

    map.flyTo(
      [geolocation.latitude, geolocation.longitude] as LatLngTuple,
      16,
      {
        animate: true,
        noMoveStart: true,
      }
    )
  }, [geolocation, map])

  useLayoutEffect(() => {
    if (!map || !coordinates) return

    map.flyTo(coordinates, mapOptions.zoom)
  }, [coordinates, map, mapOptions.zoom])

  useEffect(() => {
    global.window.scrollTo(0, 0)

    disablePageScroll()

    return enablePageScroll
  }, [])

  const mapWrapper = (
    <Wrapper data-testid="assetSelectSelector">
      <DetailPanel featureTypes={meta.featureTypes} language={meta.language} />

      <StyledMap
        hasZoomControls={desktopView}
        mapOptions={mapOptions}
        events={{ click, dblclick: doubleClick }}
        setInstance={setMap}
        hasGPSControl
      >
        <StyledViewerContainer
          topLeft={
            <TopLeftWrapper>
              <GPSButton
                onLocationSuccess={(location: LocationResult) => {
                  const { latitude, longitude } = location
                  const coordinates = {
                    lat: latitude,
                    lng: longitude,
                  } as LatLngLiteral

                  setLocation({ coordinates })
                  setGeolocation(location)
                }}
                onLocationError={() => {
                  setMapMessage(
                    <>
                      <strong>
                        {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
                      </strong>
                      <p>
                        Dit kunt u wijzigen in de voorkeuren of instellingen van
                        uw browser of systeem.
                      </p>
                    </>
                  )
                }}
                onLocationOutOfBounds={() => {
                  setMapMessage(
                    'Uw locatie valt buiten de kaart en is daardoor niet te zien'
                  )
                }}
              />

              {hasFeatureTypes && (
                <ZoomMessage
                  data-testid="zoomMessage"
                  zoomLevel={MAP_CONTAINER_ZOOM_LEVEL}
                >
                  Zoom in om de {meta?.language?.objectTypePlural || 'objecten'}{' '}
                  te zien
                </ZoomMessage>
              )}

              {mapMessage && (
                <MapMessage
                  data-testid="mapMessage"
                  onClick={() => setMapMessage('')}
                >
                  {mapMessage}
                </MapMessage>
              )}
            </TopLeftWrapper>
          }
          topRight={<MapCloseButton onClick={close} />}
        />

        <WfsLayer zoomLevel={MAP_CONTAINER_ZOOM_LEVEL}>
          <Layer featureTypes={meta.featureTypes} />
        </WfsLayer>

        {geolocation && <LocationMarker geolocation={geolocation} />}

        {showMarker && (
          <span data-testid="assetPinMarker">
            <Marker
              key={Object.values(coordinates).toString()}
              setInstance={setPinMarker}
              args={[coordinates]}
              options={{
                icon: markerIcon,
                keyboard: false,
              }}
            />
          </span>
        )}
      </StyledMap>
    </Wrapper>
  )

  return ReactDOM.createPortal(mapWrapper, appHtmlElement)
}

export default Selector
