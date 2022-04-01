// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import {
  useLayoutEffect,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import { Marker } from '@amsterdam/react-maps'
import { ViewerContainer } from '@amsterdam/arm-core'
import 'leaflet/dist/leaflet.css'

import { markerIcon } from 'shared/services/configuration/map-markers'
import configuration from 'shared/services/configuration/configuration'
import MapContext from 'containers/MapContext/context'
import {
  setLocationAction,
  setValuesAction,
  resetLocationAction,
  setLoadingAction,
} from 'containers/MapContext/actions'
import useDelayedDoubleClick from 'hooks/useDelayedDoubleClick'
import reverseGeocoderService from 'shared/services/reverse-geocoder'

import Map from '../Map'
import PDOKAutoSuggest from '../PDOKAutoSuggest'

const Wrapper = styled.div`
  position: relative;
`

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
  text-align: center;
`

const StyledViewerContainer = styled(ViewerContainer)`
  & > * {
    width: calc(
      100% - 8px
    ); // Subtract 8px to prevent horizontal scroll bar on MacOS (Firefox/Safari).
  }
`

const StyledAutosuggest = styled(PDOKAutoSuggest)`
  position: absolute;
  left: 0;
  width: 40%;
  max-width: calc(100% - 32px);
  z-index: 401; // 400 is the minimum elevation where elements are shown above the map

  @media (max-width: ${({ theme }) => theme.layouts.large.max}px) {
    width: 60%;
  }

  @media (max-width: ${({ theme }) => theme.layouts.medium.max}px) {
    width: 100%;
  }
`

const MapInput = ({
  className = '',
  hasGPSControl,
  value,
  onChange,
  mapOptions,
  events = {},
  id,
  ...rest
}) => {
  const { state, dispatch } = useContext(MapContext)
  const [map, setMap] = useState()
  const [marker, setMarker] = useState()
  const { coordinates, addressText: addressValue } = state
  const hasLocation =
    Boolean(coordinates) && coordinates?.lat !== 0 && coordinates?.lng !== 0

  /**
   * This reference ensures the map zooms to the marker location only when the marker location
   * is provided from the parent and not on click action
   */
  const hasInitalViewRef = useRef(true)

  useEffect(() => {
    if (!map) return

    map.attributionControl._container.setAttribute('aria-hidden', 'true')
    map.attributionControl.setPrefix('')
  }, [map])

  const clickFunc = useCallback(
    async ({ latlng }) => {
      hasInitalViewRef.current = false
      dispatch(setLoadingAction(true))
      dispatch(setLocationAction(latlng))

      const response = await reverseGeocoderService(latlng)
      const onChangePayload = { coordinates: latlng }
      const addressText = response?.value || ''
      const address = response?.data?.address || ''

      onChangePayload.address = response ? response.data.address : {}

      dispatch(setValuesAction({ addressText, address }))

      onChange(onChangePayload)
      dispatch(setLoadingAction(false))
    },
    [dispatch, onChange]
  )

  const onSelect = useCallback(
    (option) => {
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

      map.flyTo(option.data.location)
    },
    [map, dispatch, onChange]
  )

  const onClear = useCallback(() => {
    dispatch(resetLocationAction())
  }, [dispatch])

  const { click, doubleClick } = useDelayedDoubleClick(clickFunc)

  /**
   * Subscribe to value prop changes
   */
  useEffect(() => {
    // first component render has an empty object for `value` so we need to check for props
    if (!value || Object.keys(value).length === 0) return

    dispatch(setValuesAction(value))
  }, [value, dispatch])

  // subscribe to changes in location and render the map in that location
  // note that we're using setView instead of flyTo on the map instance to prevent remounts of this component
  // to show an animation instead of just rendering the marker on the location where it should be
  useLayoutEffect(() => {
    if (!map || !marker || !hasLocation) return

    if (hasInitalViewRef.current) {
      const zoomLevel = map.getZoom()
      map.setView(coordinates, zoomLevel < 11 ? 11 : zoomLevel)
      hasInitalViewRef.current = false
    }

    marker.setLatLng(coordinates)
  }, [marker, coordinates, hasLocation, map])

  return (
    <Wrapper className={className}>
      <StyledMap
        data-testid="mapInput"
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

MapInput.propTypes = {
  id: PropTypes.string.isRequired,
  /** @ignore */
  className: PropTypes.string,
  /**
   * Leaflet map events
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-event}
   */
  events: PropTypes.shape({}),
  hasGPSControl: PropTypes.bool,
  /**
   * leaflet options
   * @see {@link https://leafletjs.com/reference-1.6.0.html#map-option}
   */
  mapOptions: PropTypes.shape({}).isRequired,
  /**
   * Callback handler that is fired when a click on the map is registered or when an option in the autosuggest
   * list is selected
   */
  onChange: PropTypes.func,
  value: PropTypes.shape({
    coordinates: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
    addressText: PropTypes.string,
    address: PropTypes.shape({
      huisnummer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      openbare_ruimte: PropTypes.string,
      postcode: PropTypes.string,
      woonplaats: PropTypes.string,
    }),
  }),
}

export default MapInput
