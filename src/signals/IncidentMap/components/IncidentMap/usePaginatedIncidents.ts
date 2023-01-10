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
  }>({ features: [], searchParams: new URLSearchParams() })

  const getIncidents = useCallback(async (bbox: Bbox) => {
    if (bbox) {
      paginatedIncidents.current.searchParams = getSearchParams(bbox)

      // head request with x-count-total response header
      // const headResponse  = await fetch(`${
      //     configuration.GEOGRAPHY_PUBLIC_ENDPOINT
      //   }?${paginatedIncidents.current.searchParams.toString()}`,{
      //   method: 'HEAD'
      // })
      // const xTotalCount = headResponse.headers.get('X-Total-Count')

      // By doing the above head request we'll obtain the x-total-count
      const xTotalCount = 4010

      // Would be nice to get this info through the response header as well
      const paginationLength = 4000

      const promises = new Array(Math.ceil(xTotalCount / paginationLength))
        .fill(0)
        .map((_, index) => {
          const qeopageQueryParam = index > 0 ? `&geopage=${index + 1}` : ''
          return fetch(
            `${
              configuration.GEOGRAPHY_PUBLIC_ENDPOINT
            }?${paginatedIncidents.current.searchParams.toString()}${qeopageQueryParam}`,
            {
              method: 'GET',
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
          setError(error)
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
    incidents: incidents,
    error: error,
    getIncidents,
  }
}

export default usePaginatedIncidents
