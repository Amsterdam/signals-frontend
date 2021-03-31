// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { pdokResponseFieldList, formatPDOKResponse } from 'shared/services/map-location';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';

const flParams = pdokResponseFieldList.join(',');
export const serviceURL = `https://geodata.nationaalgeoregister.nl/locatieserver/revgeo?type=adres&rows=1&fl=${flParams}`;

export const formatRequest = (baseUrl, wgs84point, distance = 50) => {
  const xyRD = wgs84ToRd(wgs84point);
  return `${baseUrl}&X=${xyRD.x}&Y=${xyRD.y}&distance=${distance}`;
};

const reverseGeocoderService = async location => {
  const wgs84point = {
    lng: location.lng,
    lat: location.lat,
  };
  const url = formatRequest(serviceURL, wgs84point);

  const result = await fetch(url)
    .then(res => res.json())
    // make sure to catch any error responses from the geocoder service
    .catch(() => ({}));

  const formattedResponse = formatPDOKResponse(result);

  return formattedResponse[0];
};

export default reverseGeocoderService;
