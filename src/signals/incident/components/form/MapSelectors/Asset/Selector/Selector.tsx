// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import {
  useMemo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react'
import type { ReactElement, FC } from 'react'

import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { ChevronLeft } from '@amsterdam/asc-assets'
import { ascDefaultTheme, breakpoint, Button } from '@amsterdam/asc-ui'
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { Marker } from '@amsterdam/react-maps'
import FocusTrap from 'focus-trap-react'
import type {
  MapOptions,
  LeafletMouseEvent,
  Marker as MarkerType,
  Map as MapType,
  LatLngTuple,
} from 'leaflet'
import ReactDOM from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useMediaQuery } from 'react-responsive'
import { disablePageScroll, enablePageScroll } from 'scroll-lock'

import GPSButton from 'components/GPSButton'
import useDelayedDoubleClick from 'hooks/useDelayedDoubleClick'
import { useDeviceMode } from 'hooks/useDeviceMode'
import configuration from 'shared/services/configuration/configuration'
import { markerIcon } from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import {
  closeMap,
  updateIncident,
} from 'signals/incident/containers/IncidentContainer/actions'
import { makeSelectMaxAssetWarning } from 'signals/incident/containers/IncidentContainer/selectors'
import type { LocationResult } from 'types/location'

import DetailPanel from './DetailPanel'
import NearbyLayer from './NearbyLayer'
import {
  AddressPanel,
  StyledHeader,
  StyledPDOKAutoSuggest,
  StyledMap,
  StyledViewerContainer,
  TopLeftWrapper,
  Wrapper,
  StyledLabel,
  InputGroup,
  OptionsList,
} from './styled'
import WfsLayer from './WfsLayer'
import AssetLayer from './WfsLayer/AssetLayer'
import { formatAddress } from '../../../../../../../shared/services/format-address'
import type { PdokResponse } from '../../../../../../../shared/services/map-location'
import { MapMessage, ZoomMessage } from '../../components/MapMessage'
import { selectionIsUndetermined } from '../../constants'

const MAP_ASSETS_ZOOM_LEVEL: ZoomLevel = {
  max: configuration.map.optionsAssetSelector.assetsZoom,
}

export const MAP_LOCATION_ZOOM =
  configuration.map.optionsAssetSelector.locationZoom

const Selector: FC = () => {
  // to be replaced with MOUNT_NODE
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const appHtmlElement = document.getElementById('app')!
  const { deviceMode, isMobile } = useDeviceMode()

  const {
    coordinates,
    layer,
    setLocation,
    meta,
    selection,
    removeItem,
    fetchLocation,
    address,
  } = useContext(AssetSelectContext)
  const { maxAssetWarning } = useSelector(makeSelectMaxAssetWarning)
  const maxNumberOfAssets = meta?.maxNumberOfAssets || 1
  const [desktopView] = useMatchMedia({ minBreakpoint: 'laptop' })

  const dispatch = useDispatch()

  const center =
    coordinates || (configuration.map.options.center as LatLngTuple)

  const mapOptions: MapOptions = useMemo(
    () => ({
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

  const focusTrapOptions = {
    ...(isMobile(deviceMode) ? { initialFocus: '#gps-button' } : {}),
  }

  const [mapMessage, setMapMessage] = useState<ReactElement | string>()
  const [pinMarker, setPinMarker] = useState<MarkerType>()
  const [map, setMap] = useState<MapType>()
  const hasFeatureTypes = meta.featureTypes.length > 0
  const showMarker =
    coordinates && (!selection || selectionIsUndetermined(selection[0]))

  const mapClick = useCallback(
    ({ latlng }: LeafletMouseEvent) => {
      ;(window as any)?.dataLayer.push({
        event: 'interaction.generic.component.mapInteraction',
        meta: {
          category: 'interaction.generic.component.mapInteraction',
          action: 'pinClick',
          label: 'Click on map',
        },
      })

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
    if (!map || !coordinates) return

    const zoomLevel = mapOptions.zoom
      ? Math.max(map.getZoom(), mapOptions.zoom)
      : map.getZoom()

    if (!selection) {
      map.flyTo(coordinates, zoomLevel)
    }
  }, [coordinates, map, mapOptions.zoom, selection])

  useEffect(() => {
    global.window.scrollTo(0, 0)

    disablePageScroll()

    return enablePageScroll
  }, [])

  useEffect(() => {
    if (maxAssetWarning) {
      const number =
        maxNumberOfAssets === 1
          ? meta?.language?.objectTypeSingular || 'object'
          : meta?.language?.objectTypePlural || 'objecten'
      setMapMessage(`U kunt maximaal ${maxNumberOfAssets} ${number} kiezen.`)
    }
  }, [
    maxAssetWarning,
    maxNumberOfAssets,
    mapMessage,
    meta?.language?.objectTypePlural,
    meta?.language?.objectTypeSingular,
  ])

  const shouldRenderMobileVersion = useMediaQuery({
    query: breakpoint('max-width', 'tabletM')({ theme: ascDefaultTheme }),
  })

  const addressValue = address ? formatAddress(address) : ''

  const [optionsList, setOptionsList] = useState(null)
  const [showList, setShowList] = useState(false)

  // the following is thoroughly tested in the PDOKAutoSuggest component
  /* istanbul ignore next */
  const onAddressSelect = useCallback(
    (option: PdokResponse) => {
      const { location, address } = option.data
      setLocation({ coordinates: location, address })
      setOptionsList(null)
      ;(window as any)?.dataLayer.push({
        event: 'interaction.generic.component.mapInteraction',
        meta: {
          category: 'interaction.generic.component.mapInteraction',
          action: 'useAutosuggest', // TODO: deze actie staat niet in de lijst, kun je hier gewoon actions aan toevoegen?
          label: `${address.openbare_ruimte} ${address.huisnummer} ${address.postcode} ${address.woonplaats}`,
        },
      })
    },
    [setLocation]
  )

  // the following is thoroughly tested in the PDOKAutoSuggest component
  /* istanbul ignore next */
  const clearInput = useCallback(() => {
    removeItem()
    setOptionsList(null)
  }, [removeItem])

  const topLeft = (
    <TopLeftWrapper>
      <GPSButton
        tabIndex={0}
        onLocationSuccess={(location: LocationResult) => {
          const coordinates = {
            lat: location.latitude,
            lng: location.longitude,
          }
          fetchLocation(coordinates)
        }}
        onLocationError={() => {
          setMapMessage(
            <>
              <strong>
                {`${configuration.language.siteAddress} heeft geen
                            toestemming om uw locatie te gebruiken.`}
              </strong>
              <p>
                Dit kunt u wijzigen in de voorkeuren of instellingen van uw
                browser of systeem.
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

      {hasFeatureTypes && !shouldRenderMobileVersion && (
        <ZoomMessage
          data-testid="zoom-message"
          zoomLevel={MAP_ASSETS_ZOOM_LEVEL}
        >
          Zoom in om de {meta?.language?.objectTypePlural || 'objecten'} te zien
        </ZoomMessage>
      )}

      {mapMessage && (
        <MapMessage
          data-testid="map-message"
          onClick={() => {
            setMapMessage('')
            dispatch(updateIncident({ maxAssetWarning: false }))
          }}
        >
          {mapMessage}
        </MapMessage>
      )}
    </TopLeftWrapper>
  )
  const mapWrapper = (
    <FocusTrap focusTrapOptions={focusTrapOptions}>
      <Wrapper data-testid="asset-select-selector">
        {!showList && (
          <DetailPanel language={meta.language} zoomLevel={map?.getZoom()} />
        )}
        <StyledMap
          hasZoomControls={desktopView}
          mapOptions={mapOptions}
          events={{ click, dblclick: doubleClick }}
          setInstance={setMap}
          hasGPSControl
        >
          <StyledViewerContainer
            topLeft={shouldRenderMobileVersion ? null : topLeft}
          />

          <WfsLayer zoomLevel={MAP_ASSETS_ZOOM_LEVEL}>
            <>
              <Layer />
              <NearbyLayer zoomLevel={MAP_ASSETS_ZOOM_LEVEL} />
            </>
          </WfsLayer>

          {showMarker && (
            <span data-testid="asset-pin-marker">
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

          {shouldRenderMobileVersion && (
            <AddressPanel data-testid="address-panel" id="addressPanel">
              <StyledHeader $smallView={showList}>
                {topLeft}
                <Button
                  aria-label="Terug"
                  aria-controls="addressPanel"
                  icon={<ChevronLeft />}
                  iconSize={20}
                  onClick={() => dispatch(closeMap())}
                  size={24}
                  title="Terug"
                  variant="blank"
                />
                <InputGroup>
                  {!showList && (
                    <StyledLabel htmlFor="pdokautosuggest">
                      {meta?.language?.pdokLabel || 'Zoek op adres of postcode'}
                    </StyledLabel>
                  )}

                  <StyledPDOKAutoSuggest
                    id={'pdokautosuggest'}
                    onClear={clearInput}
                    onData={(data) => {
                      setOptionsList(data)
                    }}
                    showListChanged={(changed) => setShowList(changed)}
                    showInlineList={false}
                    onSelect={onAddressSelect}
                    value={addressValue}
                    placeholder={
                      meta?.language?.pdokInput || 'Adres of postcode'
                    }
                    autoFocus={true}
                  />
                </InputGroup>
              </StyledHeader>

              {optionsList && showList && (
                <OptionsList data-testid="options-list">
                  {optionsList}
                </OptionsList>
              )}
            </AddressPanel>
          )}
        </StyledMap>
      </Wrapper>
    </FocusTrap>
  )

  return ReactDOM.createPortal(mapWrapper, appHtmlElement)
}

export default Selector
