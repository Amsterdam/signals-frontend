// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { LatLngLiteral } from 'leaflet'
import type { Coordinates, Geometrie, Location } from 'types/incident'
import type { Incident } from 'types/api/incident'
import type { RevGeo, Doc } from 'types/pdok/revgeo'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'

export const locationTofeature = ({ lat, lng }: LatLngLiteral): Geometrie => ({
  type: 'Point',
  coordinates: [lng, lat],
})

export const featureTolocation = ({
  coordinates,
}: Geometrie): LatLngLiteral => ({ lat: coordinates[0], lng: coordinates[1] })

export const wktPointToLocation = (wktPoint: string): LatLngLiteral => {
  if (!wktPoint.includes('POINT')) {
    throw new TypeError('Provided WKT geometry is not a point.')
  }

  const coordinate = wktPoint.split('(')[1].split(')')[0]
  const lat = Number.parseFloat(coordinate.split(' ')[1])
  const lng = Number.parseFloat(coordinate.split(' ')[0])

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
  if (!location?.geometrie?.coordinates || !location.address) return {}

  return {
    coordinates: featureTolocation(location.geometrie),
    addressText: formatAddress(location.address),
    address: location.address,
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
  id: string
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
  coordinates: Coordinates,
  bounds = configuration.map.options.maxBounds
) => {
  const latWithinBounds =
    coordinates[0] > bounds[0][0] && coordinates[0] < bounds[1][0]
  const lngWithinBounds =
    coordinates[1] > bounds[0][1] && coordinates[1] < bounds[1][1]

  return latWithinBounds && lngWithinBounds
}
