import { pdokResponseFieldList, formatPDOKResponse } from 'shared/services/map-location';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';

const flParams = pdokResponseFieldList.join(',');
export const serviceURL =
    `http://geodata.nationaalgeoregister.nl/locatieserver/revgeo?type=adres&rows=1&fl=${flParams}`;

export const  formatRequest = (baseUrl, wgs84point, distance = 50) => {
  const xyRD = wgs84ToRd(wgs84point);
  return `${baseUrl}&X=${xyRD.x}&Y=${xyRD.y}&distance=${distance}`;
};

const reverseGeocoderService = async location => {
  const wgs84point = {
    longitude: location.lng,
    latitude: location.lat,
  };
  const url = formatRequest(serviceURL, wgs84point);
  const result = await fetch(url);
  const data = await result.json();
  const response = formatPDOKResponse(data);
  return response[0];
};

export default reverseGeocoderService;
