// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useEffect, useMemo, useRef } from 'react'

import type { Feature } from 'geojson'
import type { FeatureCollection } from 'geojson'

import { useFetch } from '../../../../hooks'
import configuration from '../../../../shared/services/configuration/configuration'
import type { Bbox } from '../../../incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { PointLatLng, Properties } from '../../types'

const usePaginatedIncidents = () => {
  const { get, data, error, isSuccess } =
    useFetch<FeatureCollection<PointLatLng, Properties>>()

  const paginatedIncidents = useRef<{
    page: number
    features: Feature<PointLatLng, Properties>[]
    searchParams: URLSearchParams
  }>({ page: 2, features: [], searchParams: new URLSearchParams() })

  useEffect(() => {
    const incidents = data?.features || []
    const searchParams = paginatedIncidents.current.searchParams

    if (incidents.length === 4000) {
      searchParams.set('geopage', paginatedIncidents.current.page.toString())
      get(
        `${configuration.GEOGRAPHY_PUBLIC_ENDPOINT}?${searchParams.toString()}`
      )

      paginatedIncidents.current.page = paginatedIncidents.current.page + 1
    }
  }, [data?.features, get])

  const getIncidents = useCallback(
    (bbox: Bbox) => {
      if (bbox) {
        paginatedIncidents.current.searchParams = getSearchParams(bbox)
        get(
          `${
            configuration.GEOGRAPHY_PUBLIC_ENDPOINT
          }?${paginatedIncidents.current.searchParams.toString()}`
        )
        paginatedIncidents.current.page = 2
      }
    },
    [get]
  )

  const getSearchParams = (bbox: Bbox) => {
    const { west, south, east, north } = bbox
    return new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })
  }

  const incidents = useMemo(() => {
    if (paginatedIncidents.current.page === 2 && data?.features) {
      paginatedIncidents.current.features = data.features
    }

    if (paginatedIncidents.current.page > 2 && data?.features) {
      paginatedIncidents.current.features = [
        ...data.features,
        ...paginatedIncidents.current.features,
      ]
    }

    return paginatedIncidents.current.features
  }, [data])

  return {
    incidents: incidents || [],
    isSuccess,
    error,
    getIncidents,
  }
}

export default usePaginatedIncidents
