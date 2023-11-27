// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import type { LatLngLiteral } from 'leaflet'

import configuration from 'shared/services/configuration/configuration'
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter'
import type { PdokResponse } from 'shared/services/map-location'
import { addressPDOKDetails } from 'shared/services/map-location'
import type { RevGeo } from 'types/pdok/revgeo'

const flParams = addressPDOKDetails.fields.join(',')
export const serviceURL = `${configuration.map.pdok.reverse}?type=adres&rows=1&fl=${flParams}`

export const formatRequest = (
  baseUrl: URL | string,
  wgs84point: LatLngLiteral,
  distance = 50
) => {
  const { x, y } = wgs84ToRd(wgs84point)
  return `${new URL(baseUrl).toString()}&X=${x}&Y=${y}&distance=${distance}`
}

const reverseGeocoderService = async (
  location: LatLngLiteral
): Promise<PdokResponse | undefined> => {
  const url = formatRequest(new URL(serviceURL), location)

  const result: RevGeo = await fetch(url)
    .then((res) => res.json())
    // make sure to catch any error responses from the geocoder service
    .catch(() => ({}))

  const formattedResponse = addressPDOKDetails.formatter(result)

  return formattedResponse[0]
}

export default reverseGeocoderService
