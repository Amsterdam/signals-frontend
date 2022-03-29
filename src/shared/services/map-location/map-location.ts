// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { LatLngLiteral, LatLngTuple } from 'leaflet'
import type { Geometrie, Location } from 'types/incident'
import type { Incident } from 'types/api/incident'
import type { RevGeo, Doc } from 'types/pdok/revgeo'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'

const sanitizeCoordinates = (coordinates: LatLngTuple): LatLngTuple =>
  coordinates.sort((a, b) => (a > b ? 1 : -1)).reverse() as LatLngTuple

export const coordinatesToFeature = ({
  lat,
  lng,
}: LatLngLiteral): Geometrie => ({
  type: 'Point',
  coordinates: sanitizeCoordinates([lat, lng]),
})

export const coordinatesToAPIFeature = ({
  lat,
  lng,
}: LatLngLiteral): Geometrie => ({
  type: 'Point',
  coordinates: [lng, lat] as LatLngTuple,
})

export const featureToCoordinates = ({
  coordinates,
}: Geometrie): LatLngLiteral => {
  const [lat, lng] = sanitizeCoordinates(coordinates)
  return { lat, lng }
}

export const wktPointToLocation = (wktPoint: string): LatLngLiteral => {
  const pointMatch = wktPoint.match(/\d+\.\d+/gi)

  if (!wktPoint.includes('POINT') || !pointMatch || pointMatch?.length <= 1) {
    throw new TypeError('Provided WKT geometry is not a point.')
  }

  const [lat, lng] = sanitizeCoordinates(
    pointMatch.map((str) => Number.parseFloat(str)) as LatLngTuple
  )

  return {
    lat,
    lng,
  }
}

type FormatMapLocation = {
  coordinates?: LatLngLiteral
  addressText?: string
  address?: Location['address']
}

/**
 * Converts a location and address to values
 */
export const formatMapLocation = (
  location?: Incident['location']
): FormatMapLocation => {
  if (!location?.geometrie) return {}

  return {
    coordinates: featureToCoordinates(location.geometrie),
    addressText: location.address ? formatAddress(location.address) : '',
    address: location.address ?? undefined,
  }
}

type PdokAddress = {
  openbare_ruimte: string
  huisnummer: string
  postcode: string
  woonplaats: string
}

/**
 * Convert geocode response to object with values that can be consumed by our API
 */
export const serviceResultToAddress = ({
  straatnaam,
  huis_nlt,
  postcode,
  woonplaatsnaam,
}: Doc): PdokAddress => ({
  openbare_ruimte: straatnaam,
  huisnummer: huis_nlt,
  postcode,
  woonplaats: woonplaatsnaam,
})

export const pdokResponseFieldList = [
  'id',
  'weergavenaam',
  'straatnaam',
  'huis_nlt',
  'postcode',
  'woonplaatsnaam',
  'centroide_ll',
]

export type PdokResponse = {
  id: number | string
  value: string
  data: {
    location: LatLngLiteral
    address: PdokAddress
  }
}

export const formatPDOKResponse = (
  request?: RevGeo | null
): Array<PdokResponse> =>
  request?.response?.docs.map((result) => {
    const { id, weergavenaam, centroide_ll } = result
    return {
      id,
      value: weergavenaam,
      data: {
        location: wktPointToLocation(centroide_ll),
        address: serviceResultToAddress(result),
      },
    }
  }) || []

export const pointWithinBounds = (
  coordinates: LatLngTuple,
  bounds = configuration.map.options.maxBounds
) => {
  const [lat, lng] = sanitizeCoordinates(coordinates)

  const latWithinBounds = lat > bounds[0][0] && lat < bounds[1][0]
  const lngWithinBounds = lng > bounds[0][1] && lng < bounds[1][1]

  return latWithinBounds && lngWithinBounds
}
