// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import {
  useLayoutEffect,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'

import { Marker } from '@amsterdam/react-maps'
import type {
  MapOptions,
  LeafletEventHandlerFnMap,
  Marker as MarkerType,
} from 'leaflet'
import 'leaflet/dist/leaflet.css'

import {
  setLocationAction,
  setValuesAction,
  resetLocationAction,
  setLoadingAction,
} from 'containers/MapContext/actions'
import MapContext from 'containers/MapContext/context'
import useDelayedDoubleClick from 'hooks/useDelayedDoubleClick'
import configuration from 'shared/services/configuration/configuration'
import { markerIcon } from 'shared/services/configuration/map-markers'
import type { FormatMapLocation } from 'shared/services/map-location'
import reverseGeocoderService from 'shared/services/reverse-geocoder'
import type { Location } from 'types/incident'

import {
  Wrapper,
  StyledMap,
  StyledViewerContainer,
  StyledAutosuggest,
} from './styled'

interface Props {
  className?: string
  hasGPSControl: boolean
  value?: FormatMapLocation
  onChange: (location: Location) => void
  mapOptions: MapOptions
  events?: LeafletEventHandlerFnMap
  id: string
  hasZoomControls?: boolean
}

const MapInput = ({
  className = '',
  hasGPSControl,
  value,
  onChange,
  mapOptions,
  events = {},
  id,
  ...rest
}: Props) => {
  const { state, dispatch } = useContext(MapContext)
  // const dispatch = useDispatch()
  const [map, setMap] = useState<L.Map>()
  const [marker, setMarker] = useState<MarkerType>()
  const { coordinates, addressText: addressValue } = state
  const hasLocation =
    Boolean(coordinates) && coordinates?.lat !== 0 && coordinates?.lng !== 0

  /**
   * This reference ensures the map zooms to the marker location only when the marker location
   * is provided from the parent and not on click action
   */
  const hasInitialViewRef = useRef(true)

  useEffect(() => {
    if (!map) return
    map.attributionControl.getContainer()?.setAttribute('aria-hidden', 'true')
    map.attributionControl.setPrefix(false)
  }, [map])

  const clickFunc = useCallback(
    async ({ latlng }) => {
      hasInitialViewRef.current = false

      dispatch && dispatch(setLoadingAction(true))
      dispatch && dispatch(setLocationAction(latlng))

      const response = await reverseGeocoderService(latlng)
      const onChangePayload = {
        coordinates: latlng,
        address: response && response.data.address,
      }
      const addressText = response?.value || ''
      const address = response?.data?.address || ''

      dispatch && dispatch(setValuesAction({ addressText, address }))

      onChange(onChangePayload)
      dispatch && dispatch(setLoadingAction(false))
    },
    [dispatch, onChange]
  )

  const onSelect = useCallback(
    (option) => {
      dispatch &&
        dispatch(
          setValuesAction({
            coordinates: option.data.location,
            address: option.data.address,
            addressText: option.value,
          })
        )

      onChange({
        coordinates: option.data.location,
        address: option.data.address,
      })

      map?.flyTo(option.data.location)
    },
    [map, dispatch, onChange]
  )

  const onClear = useCallback(() => {
    dispatch && dispatch(resetLocationAction())
  }, [dispatch])

  const { click, doubleClick } = useDelayedDoubleClick(clickFunc)

  /**
   * Subscribe to value prop changes
   */
  useEffect(() => {
    // first component render has an empty object for `value` so we need to check for props
    if (!value || Object.keys(value).length === 0) return
    dispatch && dispatch(setValuesAction(value))
  }, [value, dispatch])

  // subscribe to changes in location and render the map in that location
  // note that we're using setView instead of flyTo on the map instance to prevent remounts of this component
  // to show an animation instead of just rendering the marker on the location where it should be
  useLayoutEffect(() => {
    if (!map || !marker || !hasLocation) return

    if (hasInitialViewRef.current) {
      const zoomLevel = map.getZoom()
      map.setView(coordinates, zoomLevel < 11 ? 11 : zoomLevel)
      hasInitialViewRef.current = false
    }

    marker.setLatLng(coordinates)
  }, [marker, coordinates, hasLocation, map])

  return (
    <Wrapper className={className}>
      <StyledMap
        data-testid="map-input"
        events={{ click, dblclick: doubleClick, ...events }}
        hasGPSControl={hasGPSControl}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMap}
      >
        <StyledViewerContainer
          topLeft={
            <StyledAutosuggest
              municipality={configuration.map?.municipality}
              onClear={onClear}
              onSelect={onSelect}
              placeholder="Zoek adres"
              value={addressValue}
              id={id}
              {...rest}
            />
          }
        />
        {hasLocation && (
          <Marker
            setInstance={setMarker}
            args={[coordinates]}
            options={{
              icon: markerIcon,
              keyboard: false,
            }}
          />
        )}
      </StyledMap>
    </Wrapper>
  )
}

export default MapInput
