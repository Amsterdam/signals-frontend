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

import ZoomMessageControl from './control/ZoomMessageControl'
import LegendControl from './control/LegendControl'
import LoadingControl from './control/LoadingControl'
import ErrorControl from './control/ErrorControl'
import { getIsReportedLayer } from './ReportedLayer/reportedLayer'
import { ZOOM_MIN, ZOOM_MAX } from './constants'

import './style.scss'

const SELECTION_MAX_COUNT = 30

const Wrapper = styled.div`
  position: relative;
`

const StyledMap = styled(Map)`
  height: 450px;
  width: 100%;
  font-family: 'Avenir Next LT W01-Regular', arial, sans-serif;
`

const MapSelect = ({
  geojsonUrl,
  getIcon,
  hasGPSControl,
  iconField,
  idField,
  latlng,
  legend,
  onSelectionChange,
  selectionOnly,
  value,
  ...rest
}) => {
  const featuresLayer = useRef()
  const isReportedLayer = useRef()
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

  const getFetchRequest = useCallback(
    ({ filterReported }) =>
      async (bbox) => {
        const [EAST, SOUTH, WEST, NORTH] = bbox.split(',')

        const requestUrl = geojsonUrl
          .replace('{east}', EAST)
          .replace('{west}', WEST)
          .replace('{north}', NORTH)
          .replace('{south}', SOUTH)
          .concat(filterReported ? '&meldingstatus=1' : '')

        return request(requestUrl).catch(() => {
          errorControl.show()
        })
      },
    [errorControl, geojsonUrl]
  )

  const filter = useCallback(
    (feature) => {
      return selectionOnly
        ? selection.current.has(feature.properties[idField])
        : true
    },
    [idField, selectionOnly, selection]
  )

  const bboxGeoJsonLayer = useMemo(
    () =>
      BboxGeojsonLayer(
        { fetchRequest: getFetchRequest({ filterReported: false }) },
        {
          zoomMin: ZOOM_MIN,
          zoomMax: ZOOM_MAX,

          /**
           * Function that will be used to decide whether to include a feature or not. The default is to include all
           * features.
           */
          filter,

          /**
           * Function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added,
           * passing the GeoJSON point feature and its LatLng.
           * Return value overridden to have it return a marker with a specific icon
           *
           * Note that this behaviour is difficult to test, hence the istanbul ignore
           */
          pointToLayer: /* istanbul ignore next */ (feature, latlong) =>
            L.marker(latlong, {
              icon: getIcon(
                feature.properties[iconField],
                selection.current.has(feature.properties[idField])
              ),
              alt: selectionOnly ? '' : feature.properties.objectnummer,
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
    [
      filter,
      getFetchRequest,
      getIcon,
      iconField,
      idField,
      onSelectionChange,
      selectionOnly,
    ]
  )

  const isReportedGeoJsonLayer = getIsReportedLayer(
    getFetchRequest({ filterReported: true }),
    filter
  )

  /**
   * Set the features layer on mount
   */
  useLayoutEffect(() => {
    featuresLayer.current = bboxGeoJsonLayer
    isReportedLayer.current = isReportedGeoJsonLayer
    // only execute on mount; disabling linter
    // eslint-disable-next-line
  }, [])

  /**
   * Initialise the whole map when its instance can be retrieved from the DOM
   */
  useEffect(() => {
    if (!mapInstance) return undefined

    featuresLayer.current.addTo(mapInstance)
    isReportedLayer.current.addTo(mapInstance)

    const zoomMessageControl = new ZoomMessageControl({
      position: 'topleft',
      zoomMin: ZOOM_MIN,
    })

    zoomMessageControl.addTo(mapInstance)

    if (legend) {
      // only show if legend items are provided
      const legendControl = new LegendControl({
        position: 'topright',
        zoomMin: ZOOM_MIN,
        elements: legend,
      })

      legendControl.addTo(mapInstance)
    }

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
        const iconType = properties[iconField]
        const icon = getIcon(iconType, selection.current.has(id))

        layer.setIcon(icon)
      })
    },
    // only execute when value changes; disabling linter
    // eslint-disable-next-line
    [value]
  )

  return (
    <Wrapper {...rest}>
      <StyledMap
        className={classNames('map-component', { write: onSelectionChange })}
        data-testid="mapSelect"
        hasGPSControl={hasGPSControl}
        hasZoomControls
        mapOptions={mapOptions}
        setInstance={setMapInstance}
      />
    </Wrapper>
  )
}

MapSelect.defaultProps = {
  hasGPSControl: false,
  value: [],
  selectionOnly: false,
}

MapSelect.propTypes = {
  latlng: PropTypes.exact({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  geojsonUrl: PropTypes.string.isRequired,
  onSelectionChange: PropTypes.func,
  getIcon: PropTypes.func.isRequired,
  hasGPSControl: PropTypes.bool,
  legend: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      iconUrl: PropTypes.string.isRequired,
    })
  ),
  iconField: PropTypes.string.isRequired,
  idField: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  selectionOnly: PropTypes.bool,
}

export default MapSelect
