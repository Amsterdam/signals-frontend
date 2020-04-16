import { pdokResponseFieldList, formatPDOKResponse } from 'shared/services/map-location';
import { wgs84ToRd } from 'shared/services/crs-converter/crs-converter';

const flParams = pdokResponseFieldList.join(',');
export const serviceURL = `https://geodata.nationaalgeoregister.nl/locatieserver/revgeo?type=adres&rows=1&fl=${flParams}`;

export const findFeatureByType = (features, type) => {
  const feature = features.find(feat => feat.properties.type === type);

  return feature?.properties;
};

export const getStadsdeel = async ({ lat, lng }) => {
  const bagSserviceURL = `https://api.data.amsterdam.nl/geosearch/bag/?lat=${lat}&lon=${lng}&radius=50`;
  const res = await fetch(bagSserviceURL).then(result => result.json());
  const stadsdeel = findFeatureByType(res.features, 'gebieden/stadsdeel');

  return stadsdeel !== undefined ? stadsdeel.code : null;
};

export const formatRequest = (baseUrl, wgs84point, distance = 50) => {
  const xyRD = wgs84ToRd(wgs84point);
  return `${baseUrl}&X=${xyRD.x}&Y=${xyRD.y}&distance=${distance}`;
};

const reverseGeocoderService = async location => {
  const wgs84point = {
    longitude: location.lng,
    latitude: location.lat,
  };
  const url = formatRequest(serviceURL, wgs84point);
  const result = await fetch(url).then(res => res.json());
  const formattedResponse = formatPDOKResponse(result)[0];

  return formattedResponse;
};

export default reverseGeocoderService;
