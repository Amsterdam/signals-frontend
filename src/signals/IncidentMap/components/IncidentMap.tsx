// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { Dispatch, FC, SetStateAction } from 'react'
import { memo, useState, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import format from 'date-fns/format'
import subDays from 'date-fns/addDays'

import type {
  Map as MapType,
  MarkerCluster as MarkerClusterType,
} from 'leaflet'
import L from 'leaflet'
import type { Geometrie } from 'types/incident'

import MAP_OPTIONS from 'shared/services/configuration/map-options'
import configuration from 'shared/services/configuration/configuration'
import { featureToCoordinates } from 'shared/services/map-location'
import { makeSelectFilterParams } from 'signals/incident-management/selectors'
import useFetch from 'hooks/useFetch'
import {
  incidentIcon,
  markerIcon,
} from 'shared/services/configuration/map-markers'
import MarkerCluster from 'components/MarkerCluster/MarkerCluster'
import DetailPanel from 'signals/incident/components/form/MapSelectors/Asset/Selector/DetailPanel/DetailPanel'

import type { IncidentSummary } from 'components/OverviewMap/types'
import styled from 'styled-components'
import { breakpoint } from '@amsterdam/asc-ui'
import { AssetSelectProvider } from 'signals/incident/components/form/MapSelectors/Asset/context'
import type { Location } from 'types/incident'
import Map from '../../../components/Map'
import type { AssetSelectValue } from '../../incident/components/form/MapSelectors/Asset/types'

export const Wrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  box-sizing: border-box; // Override box-sizing: content-box set by Leaflet
  z-index: 2; // position over the site header
  display: flex;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    flex-direction: column;
  }
`

export const StyledMap = styled(Map)`
  height: 800px;
  width: 100%;
  z-index: 0;
`

interface Feature {
  geometry: Geometrie
  properties: IncidentSummary
}

interface Data {
  features: Feature[]
}

export const POLLING_INTERVAL = 5000

/* istanbul ignore next */
const clusterLayerOptions = {
  zoomToBoundsOnClick: true,
  chunkedLoading: true,
}

interface OverviewMapProps {
  refresh?: boolean
  hideButtons?: boolean
}

const IncidentMap: FC<OverviewMapProps> = ({
  refresh,
  hideButtons,
  ...rest
}) => {
  const endpoint = configuration.GEOGRAPHY_ENDPOINT
  const [initialMount, setInitialMount] = useState(false)
  const [map, setMap] = useState<MapType>()
  const filterParams = useSelector(makeSelectFilterParams)
  const { get, data, isLoading } = useFetch<Data>()
  const [layerInstance, setLayerInstance] = useState<L.LayerGroup>()
  const [pollingCount, setPollingCount] = useState(0)

  /**
   * AutoSuggest callback handler
   *
   * Note that testing this functionality resembles integration testing, hence disabling istanbul coverage
   */
  const onSelect = useCallback(
    /* istanbul ignore next */ (location: Location) => {
      if (map) {
        const currentZoom = map.getZoom()
        map.flyTo(location.coordinates, currentZoom < 11 ? 11 : currentZoom)
      }
    },
    [map]
  )

  const meldingenkaartContext: AssetSelectValue = {
    coordinates: undefined,
    message: undefined,
    meta: {
      endpoint: '',
      featureTypes: [],
      featureStatusTypes: [],
      extraProperties: [],
      maxNumberOfAssets: undefined,
      language: {
        title: ' ',
        subTitle: ' ',
        description:
          'Op deze kaart staan meldingen in de openbare ruimte waarmee we ' +
          'aan het werk zijn. Vanwege privacy staan niet alle meldingen op de kaart.',
      },
    },
    selection: undefined,
    fetchLocation: /* istanbul ignore next */ () => {},
    setLocation: onSelect,
    setMessage: /* istanbul ignore next */ () => {},
    setItem: /* istanbul ignore next */ () => {},
    removeItem: /* istanbul ignore next */ () => {},
  }

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
        }
      )

      layerInstance.addLayer(clusteredMarker)
    })

    return () => {
      layerInstance.clearLayers()
    }
  })

  return (
    <AssetSelectProvider value={meldingenkaartContext}>
      <Wrapper {...rest}>
        <DetailPanel
          language={meldingenkaartContext.meta.language}
          hideLegendButton={hideButtons}
        />
        <StyledMap
          data-testid="overviewMap"
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
        </StyledMap>
      </Wrapper>
    </AssetSelectProvider>
  )
}

export default memo(IncidentMap)
