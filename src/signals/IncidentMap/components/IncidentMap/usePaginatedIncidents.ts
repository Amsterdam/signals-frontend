// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useRef, useState } from 'react'

import type { Feature } from 'geojson'

import configuration from '../../../../shared/services/configuration/configuration'
import type { Bbox } from '../../../incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { PointLatLng, Properties } from '../../types'

const usePaginatedIncidents = () => {
  const [incidents, setIncidents] = useState([])
  const [error, setError] = useState('')

  const paginatedIncidents = useRef<{
    features: Feature<PointLatLng, Properties>[]
    searchParams: URLSearchParams
    controller: AbortController
  }>({
    features: [],
    searchParams: new URLSearchParams(),
    controller: new AbortController(),
  })

  const getIncidents = useCallback(async (bbox: Bbox) => {
    if (bbox) {
      paginatedIncidents.current.searchParams = getSearchParams(bbox)
      paginatedIncidents.current.controller.abort()
      paginatedIncidents.current.controller = new AbortController()

      const { signal } = paginatedIncidents.current.controller

      let headResponse
      try {
        headResponse = await fetch(
          `${
            configuration.GEOGRAPHY_PUBLIC_ENDPOINT
          }?${paginatedIncidents.current.searchParams.toString()}`,
          {
            method: 'HEAD',
            signal,
          }
        )
      } catch (error) {
        return
      }

      const xTotalCount = Number(headResponse.headers.get('X-Total-Count'))

      // Would be nice to get this info through the response header as well
      const paginationLength = 4000

      const promises = new Array(Math.ceil(xTotalCount / paginationLength))
        .fill(0)
        .map((_, index) => {
          const qeopageQueryParam = `&geopage=${index + 1}`
          return fetch(
            `${
              configuration.GEOGRAPHY_PUBLIC_ENDPOINT
            }?${paginatedIncidents.current.searchParams.toString()}${qeopageQueryParam}`,
            {
              method: 'GET',
              signal,
            }
          )
        })

      Promise.all(promises)
        .then((responses) => {
          return Promise.all(responses.map((response) => response.json()))
        })
        .then((res) => {
          const incidents = res.reduce((prev, responseItem) => {
            return [...prev, ...responseItem.features]
          }, [])
          setIncidents(incidents)
        })
        .catch((error) => {
          if (error.name !== 'AbortError') setError(error)
        })
    }
  }, [])

  const getSearchParams = (bbox: Bbox) => {
    const { west, south, east, north } = bbox
    return new URLSearchParams({
      bbox: `${west},${south},${east},${north}`,
    })
  }

  return {
    incidents,
    error,
    getIncidents,
  }
}

export default usePaginatedIncidents
