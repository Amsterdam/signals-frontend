// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { LatLng } from 'leaflet'

import type { LatLngLiteral } from 'leaflet'
import type { Coordinates, Geometrie, Location } from 'types/incident'
import type { RevGeo, Doc } from 'types/pdok/revgeo'

import configuration from 'shared/services/configuration/configuration'
import { formatAddress } from 'shared/services/format-address'

export const locationTofeature = (location: LatLngLiteral): Geometrie => ({
  type: 'Point',
  coordinates: [location.lng, location.lat],
})

export const featureTolocation = ({
  coordinates,
}: {
  coordinates: Coordinates
}) => new LatLng(coordinates[1], coordinates[0])

export const wktPointToLocation = (wktPoint: string) => {
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

type MapLocation = Partial<Location> & {
  buurtcode?: Location['buurt_code']
}

/**
 * converts the location from `sia` location format to latlon format
 */
export const mapLocation = (loc: Location) => {
  const value: MapLocation = {}

  if (loc.geometrie) {
    value.geometrie = loc.geometrie
  }

  if (loc.buurt_code) {
    value.buurtcode = loc.buurt_code
  }

  if (loc.stadsdeel) {
    value.stadsdeel = loc.stadsdeel
  }

  if (loc.address) {
    value.address = loc.address
  }

  return value
}

type FormatMapLocation = {
  location?: LatLng
  addressText?: string
  address?: Location['address']
}

/**
 * Converts a location and address to values
 */
export const formatMapLocation = (location?: Location) => {
  const value: FormatMapLocation = {}

  if (location?.geometrie) {
    value.location = featureTolocation(location.geometrie)
  }

  if (location?.address) {
    value.addressText = formatAddress(location.address)
    value.address = location.address
  }

  return value
}

/**
 * Convert geocode response to object with values that can be consumed by our API
 */
export const serviceResultToAddress = ({
  straatnaam,
  huis_nlt,
  postcode,
  woonplaatsnaam,
}: Doc) => ({
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

export const formatPDOKResponse = (request?: RevGeo | null) =>
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
