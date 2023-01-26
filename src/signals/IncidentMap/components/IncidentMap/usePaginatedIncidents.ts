// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useRef, useState } from 'react'

import type { Feature } from 'geojson'

import type { FetchError } from '../../../../hooks/useFetch'
import configuration from '../../../../shared/services/configuration/configuration'
import type { Bbox } from '../../../incident/components/form/MapSelectors/hooks/useBoundingBox'
import type { PointLatLng, Properties } from '../../types'

const usePaginatedIncidents = () => {
  const [incidents, setIncidents] = useState<
    Feature<PointLatLng, Properties>[]
  >([])
  const [error, setError] = useState<FetchError | null>(null)

  const paginatedIncidents = useRef<{
    searchParams: URLSearchParams
    controller?: AbortController
  }>({
    searchParams: new URLSearchParams(),
  })

  const getIncidents = useCallback(async (bbox: Bbox) => {
    paginatedIncidents.current.searchParams = getSearchParams(bbox)
    paginatedIncidents.current.controller?.abort()
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
      if (!headResponse.ok) {
        throw new Error('HTTP status code: ' + headResponse.status)
      }
    } catch (error: FetchError | any) {
      /* istanbul ignore next */
      if (error.name !== 'AbortError') {
        setError(error)
      }
      return
    }

    const xTotalCount = Number(headResponse.headers.get('X-Total-Count'))
    // Would be nice to get this info through the response header as well
    const paginationLength = 4000

    const promises = Array.from(
      {
        length: Math.ceil(xTotalCount / paginationLength),
      },
      (_, index) => {
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
      }
    )

    try {
      const responses = await Promise.all(promises)
      const responseJson = await Promise.all(
        responses.map((response) => response.json())
      )

      const incidents: Array<Feature<PointLatLng, Properties>> =
        responseJson.flatMap((responseItem) => responseItem.features)

      setIncidents(incidents)

      if (!responses.some((response) => response.ok)) {
        throw new Error(
          'HTTP status codes: ' +
            responses.map((response) => response.status).join(', ')
        )
      }
    } catch (error: FetchError | any) {
      /* istanbul ignore next */
      if (error.name !== 'AbortError') {
        setError(error)
      }
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
