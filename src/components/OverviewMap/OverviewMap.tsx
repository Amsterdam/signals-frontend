// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { Dispatch, FC, SetStateAction } from 'react'
import {
  memo,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'

import { ViewerContainer } from '@amsterdam/arm-core'
import { themeSpacing } from '@amsterdam/asc-ui'
import subDays from 'date-fns/addDays'
import format from 'date-fns/format'
import type {
  Map as MapType,
  MarkerCluster as MarkerClusterType,
} from 'leaflet'
import L from 'leaflet'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import Map from 'components/Map'
import PDOKAutoSuggest from 'components/PDOKAutoSuggest'
import { setAddressAction } from 'containers/MapContext/actions'
import MapContext from 'containers/MapContext/context'
import useFetch from 'hooks/useFetch'
import configuration from 'shared/services/configuration/configuration'
import {
  incidentIcon,
  markerIcon,
} from 'shared/services/configuration/map-markers'
import MAP_OPTIONS from 'shared/services/configuration/map-options'
import { featureToCoordinates } from 'shared/services/map-location'
import type { PdokResponse } from 'shared/services/map-location'
import { makeSelectFilterParams } from 'signals/incident-management/selectors'
import type { Geometrie } from 'types/incident'

import DetailPanel from './DetailPanel'
import type { IncidentSummary } from './types'
import MarkerCluster from '../MarkerCluster'

interface Feature {
  geometry: Geometrie
  properties: IncidentSummary
}

interface Data {
  features: Feature[]
}

export const POLLING_INTERVAL = 5000

const StyledViewerContainer = styled(ViewerContainer)`
  flex-direction: row;

  & > * {
    left: ${themeSpacing(4)};
    right: ${themeSpacing(4)};
  }
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const StyledMap = styled(Map)`
  height: 600px;
  width: 100%;
`

const Autosuggest = styled(PDOKAutoSuggest)`
  max-width: calc(100% - 40px);
  z-index: 401; // 400 is the minimum elevation where elements are shown above the map
  width: 350px;
  left: 0;
  position: absolute;
`

/* istanbul ignore next */
const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}
interface OverviewMapProps {
  isPublic?: boolean
  refresh?: boolean
}

const OverviewMap: FC<OverviewMapProps> = ({
  isPublic = false,
  refresh,
  ...rest
}) => {
  const endpoint = isPublic
    ? configuration.MAP_SIGNALS_ENDPOINT
    : configuration.GEOGRAPHY_ENDPOINT
  const { dispatch } = useContext(MapContext)
  const [initialMount, setInitialMount] = useState(false)
  const [showPanel, setShowPanel] = useState(false)
  const [map, setMap] = useState<MapType>()
  const filterParams = useSelector(makeSelectFilterParams)
  const { get, data, isLoading } = useFetch<Data>()
  const [layerInstance, setLayerInstance] = useState<L.LayerGroup>()
  const [incident, setIncident] = useState<IncidentSummary>()
  const [pollingCount, setPollingCount] = useState(0)

  map?.attributionControl.setPrefix(false)

  const params = useMemo(
    () => ({
      ...filterParams,
      // fixed query period (24 hours, with featuere flag mapFilter24Hours enabled)
      created_after: configuration.featureFlags.mapFilter24Hours
        ? format(subDays(new Date(), -1), "yyyy-MM-dd'T'HH:mm:ss")
        : (filterParams as Record<string, unknown>).created_after,
      created_before: configuration.featureFlags.mapFilter24Hours
        ? format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
        : (filterParams as Record<string, unknown>).created_before,
      // fixed page size (default is 50; 4000 is 2.5 times the highest daily average)
      page_size: 4000,
    }),
    [filterParams]
  )

  /**
   * AutoSuggest callback handler
   *
   * Note that testing this functionality resembles integration testing, hence disabling istanbul coverage
   */
  const onSelect = useCallback(
    /* istanbul ignore next */ (option: PdokResponse) => {
      if (dispatch) {
        dispatch(setAddressAction(option.value))
      }

      if (map) {
        const currentZoom = map.getZoom()
        const flyToMinZoom = configuration.map.optionsOverviewMap.flyToMinZoom
        map.flyTo(
          option.data.location,
          currentZoom < flyToMinZoom ? flyToMinZoom : currentZoom
        )
      }
    },
    [map, dispatch]
  )

  /* istanbul ignore next */
  const resetMarkerIcons = useCallback(() => {
    if (!map) return

    map.eachLayer((markerClustLayer) => {
      const layer = markerClustLayer as MarkerClusterType

      if (typeof layer.getIcon === 'function' && !layer.getAllChildMarkers) {
        layer.setIcon(incidentIcon)
      }
    })
  }, [map])

  /* istanbul ignore next */
  const onClosePanel = useCallback(() => {
    setShowPanel(false)
    resetMarkerIcons()
  }, [resetMarkerIcons])

  useEffect(() => {
    if (!refresh) {
      return
    }
    let active = true
    const pollingFn = () => {
      /* istanbul ignore else */
      if (active) setPollingCount(pollingCount + 1)
    }
    const intervalId = setInterval(pollingFn, POLLING_INTERVAL)
    return () => {
      active = false
      clearInterval(intervalId)
    }
  }, [refresh, pollingCount, setPollingCount])

  useEffect(() => {
    if (isLoading || !initialMount) return

    void get(`${endpoint}`, params)

    // Only execute when the value of filterParams changes; disabling linter
    // eslint-disable-next-line
  }, [filterParams, pollingCount])

  // request data on mount
  useEffect(() => {
    void get(`${endpoint}`, params)
    setInitialMount(true)
    // eslint-disable-next-line
  }, [get])

  useEffect(() => {
    if (!data?.features || !layerInstance) return

    data.features.forEach((feature) => {
      const latlng = featureToCoordinates(feature.geometry)

      const clusteredMarker = L.marker(latlng, {
        icon: incidentIcon,
      })

      /* istanbul ignore next */
      clusteredMarker.on(
        'click',
        (event: {
          target: { setIcon: (icon: L.Icon<L.IconOptions>) => void }
        }) => {
          resetMarkerIcons()

          event.target.setIcon(markerIcon)

          if (feature.properties?.id) {
            setIncident(feature.properties)
            setShowPanel(true)
          }
        }
      )

      layerInstance.addLayer(clusteredMarker)
    })

    return () => {
      layerInstance.clearLayers()
    }
  })

  return (
    <Wrapper {...rest}>
      <StyledMap
        data-testid="overview-map"
        hasZoomControls
        mapOptions={{
          ...MAP_OPTIONS,
          ...(configuration.map.optionsBackOffice || {}),
        }}
        setInstance={setMap}
      >
        <MarkerCluster
          clusterOptions={clusterLayerOptions}
          setInstance={setLayerInstance as Dispatch<SetStateAction<unknown>>}
        />
        <StyledViewerContainer
          topLeft={
            <Autosuggest
              fieldList={['centroide_ll']}
              municipality={configuration.map?.municipality}
              onSelect={onSelect}
              placeholder="Zoom naar adres"
            />
          }
          topRight={
            showPanel &&
            incident && (
              /* istanbul ignore next */
              <DetailPanel incident={incident} onClose={onClosePanel} />
            )
          }
        />
      </StyledMap>
    </Wrapper>
  )
}

export default memo(OverviewMap)
