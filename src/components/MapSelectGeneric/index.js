// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import BboxGeojsonLayer from '@datapunt/leaflet-geojson-bbox-layer'
import 'leaflet/dist/leaflet.css'
import classNames from 'classnames'

import Map from 'components/Map'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import request from 'utils/request'
import MaxSelection from 'utils/maxSelection'

import ZoomMessageControl from '../MapSelect/control/ZoomMessageControl'
import LoadingControl from '../MapSelect/control/LoadingControl'
import ErrorControl from '../MapSelect/control/ErrorControl'
import Wrapper from './styled'

const SELECTION_MAX_COUNT = 30
export const SRS_NAME = 'urn:ogc:def:crs:EPSG::4326'

const defaultOptions = {
  className: 'object-marker',
  iconSize: [32, 32],
}
const LeafletDotIcon = L.icon({
  ...defaultOptions,
  iconUrl: '/assets/images/icon-dot-marker.svg',
})
const LeafletDotSelectedIcon = L.icon({
  ...defaultOptions,
  iconUrl: '/assets/images/icon-dot-selected-marker.svg',
})

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
  font-family: Avenir Next;
`

const MapSelectGeneric = ({
  geojsonUrl,
  hasGPSControl = false,
  idField,
  latlng,
  onSelectionChange,
  selectionOnly = false,
  value = [],
}) => {
  const zoomMin = 13
  const featuresLayer = useRef()
  const [mapInstance, setMapInstance] = useState()
  const selection = useRef(new MaxSelection(SELECTION_MAX_COUNT, value))
  const mapOptions = {
    ...MAP_OPTIONS,
    center: [latlng.latitude, latlng.longitude],
    zoomControl: false,
    minZoom: 10,
    maxZoom: 15,
    zoom: 14,
  }

  const errorControl = useMemo(
    () =>
      new ErrorControl({
        position: 'topleft',
        message:
          'Oops, de objecten kunnen niet worden getoond. Probeer het later nog eens.',
      }),
    []
  )

  const fetchRequest = useCallback(
    (bboxStringLngLat) => {
      const [longitude1, latitude1, longitude2, latitude2] =
        bboxStringLngLat.split(',')
      const bboxStringLatLng = [
        latitude1,
        longitude1,
        latitude2,
        longitude2,
      ].join(',')
      const urlReplacements = {
        bboxLatLng: bboxStringLatLng,
        bboxLngLat: bboxStringLngLat,
        srsName: SRS_NAME,
      }
      const requestUrl = Object.entries(urlReplacements).reduce(
        (acc, [key, replacement]) =>
          acc.replace(new RegExp(`{{${key}}}`, 'g'), replacement),
        geojsonUrl
      )
      return request(requestUrl).catch(() => {
        errorControl.show()
      })
    },
    [errorControl, geojsonUrl]
  )

  const bboxGeoJsonLayer = useMemo(
    () =>
      BboxGeojsonLayer(
        {
          fetchRequest,
        },
        {
          zoomMin,

          zoomMax: 15,

          /**
           * Function that will be used to decide whether to include a feature or not. The default is to include all
           * features.
           *
           * Note that this behaviour is difficult to test, hence the istanbul ignore
           */
          filter: /* istanbul ignore next */ (feature) =>
            selectionOnly
              ? selection.current.has(feature.properties[idField])
              : true,

          /**
           * Function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added,
           * passing the GeoJSON point feature and its LatLng.
           * Return value overridden to have it return a marker with a specific icon
           *
           * Note that this behaviour is difficult to test, hence the istanbul ignore
           */
          pointToLayer: /* istanbul ignore next */ (feature, latlong) =>
            L.marker(latlong, {
              icon: selection.current.has(feature.properties[idField])
                ? LeafletDotSelectedIcon
                : LeafletDotIcon,
              alt: selectionOnly ? '' : feature.properties[idField],
            }),

          /**
           * Function called once for each created Feature, after it has been created and styled.
           * Attaches click handler to markers that are rendered on the map
           *
           * Note that this behaviour is difficult to test, hence the istanbul ignore
           */
          onEachFeature: /* istanbul ignore next */ (feature, layer) => {
            if (onSelectionChange) {
              // Check that the component is in write mode
              layer.on({
                click: (e) => {
                  const _layer = e.target
                  const id = _layer.feature.properties[idField]
                  selection.current.toggle(id)

                  onSelectionChange(selection.current)
                },
              })
            }
          },
        }
      ),
    [fetchRequest, idField, onSelectionChange, selection, selectionOnly]
  )

  /**
   * Set the features layer on mount
   */
  useLayoutEffect(() => {
    featuresLayer.current = bboxGeoJsonLayer
    // only execute on mount; disabling linter
    // eslint-disable-next-line
  }, [])

  /**
   * Initialise the whole map when its instance can be retrieved from the DOM
   */
  useEffect(() => {
    if (!mapInstance) return undefined

    featuresLayer.current.addTo(mapInstance)

    const zoomMessageControl = new ZoomMessageControl({
      position: 'topleft',
      zoomMin,
    })

    zoomMessageControl.addTo(mapInstance)

    const div = L.DomUtil.create('div', 'loading-control')
    div.innerText = 'Bezig met laden...'

    const loadingControl = new LoadingControl({
      position: 'topleft',
      element: div,
    })

    loadingControl.addTo(mapInstance)

    errorControl.addTo(mapInstance)

    return () => {
      mapInstance.remove()
    }
    // only execute when the mapInstance is available; disabling linter
    // eslint-disable-next-line
  }, [mapInstance])

  /**
   * Registering to value changes
   * Value changes happen when a marker on the map is clicked (see onEachFeature). Each marker is looped over and its
   * correct icon is set based on the selected values.
   *
   * Note that this behaviour is next to impossible to test. Hence the istanbul ignore.
   */
  useEffect(
    /* istanbul ignore next */ () => {
      if (!featuresLayer.current) return

      selection.current.set.clear()

      for (const id of value) {
        selection.current.add(id)
      }

      // Let icons reflect new selection
      featuresLayer.current.getLayers().forEach((layer) => {
        const properties = layer.feature.properties
        const id = properties[idField]
        const icon = selection.current.has(id)
          ? LeafletDotSelectedIcon
          : LeafletDotIcon

        layer.setIcon(icon)
      })
    },
    // only execute when value changes; disabling linter
    // eslint-disable-next-line
    [value]
  )

  return (
    <Wrapper>
      <StyledMap
        className={classNames('map-component', { write: onSelectionChange })}
        data-testid="mapSelectGeneric"
        hasGPSControl={hasGPSControl}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMapInstance}
      />
    </Wrapper>
  )
}

MapSelectGeneric.propTypes = {
  latlng: PropTypes.exact({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  geojsonUrl: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func,
  hasGPSControl: PropTypes.bool,
  idField: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  selectionOnly: PropTypes.bool,
}

export default MapSelectGeneric
