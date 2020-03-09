import proj4 from 'proj4';
import { getAddressById } from './api';

export const GEOCODER_API_REVERSE_LOOKUP =
  'http://geodata.nationaalgeoregister.nl/locatieserver/revgeo?type=adres&rows=1';

proj4.defs(
  'EPSG:28992',
  `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs`
);

export const transformCoords = proj4('EPSG:4326', 'EPSG:28992');

// utility function
const query = async url => {
  const result = await window.fetch(url);
  return result.json();
};

function requestFormatter(baseUrl, xy, distance = 50) {
  const xyRD = transformCoords.forward(xy);
  return `${baseUrl}&X=${xyRD.x}&Y=${xyRD.y}&distance=${distance}`;
}

// chain of API requests for single-click
// 1. get BAG information.
// 2. get locationinfo
const getBagInfo = async click => {
  const xy = {
    x: click.latlng.lng,
    y: click.latlng.lat,
  };
  const url = requestFormatter(GEOCODER_API_REVERSE_LOOKUP, xy);
  const result = await query(url);
  return {
    location: {
      lat: click.latlng.lat,
      lng: click.latlng.lng,
    },
    address: result.response.docs[0],
  };
};

const getAddressInfo = async data => {
  const address = data.address && (await getAddressById(data.address?.id));
  const result = {
    ...data,
    address,
  };
  return result;
};

function findFeatureByType(features, type) {
  const feature = features.find(feat => feat.properties.type === type);
  if (feature === undefined) return null;
  return feature.properties;
}

async function getLocationInfo(data) {
  const { location } = data;
  const res = await query(
    `https://api.data.amsterdam.nl/geosearch/bag/?lat=${location.lat}&lon=${location.lng}&radius=50`
  );
  const buurtinfo = findFeatureByType(res.features, 'gebieden/buurt');
  const stadsdeelinfo = findFeatureByType(res.features, 'gebieden/stadsdeel');
  if (buurtinfo !== null && stadsdeelinfo !== null) {
    return {
      ...data,
      buurtcode: buurtinfo !== undefined ? buurtinfo.vollcode : null,
      stadsdeelcode: stadsdeelinfo !== undefined ? stadsdeelinfo.code : null,
    };
  }

  return data;
}

const pointQuery = async event => {
  try {
    const data = await getBagInfo(event)
      .then(getAddressInfo)
      .then(getLocationInfo);
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    throw e;
  }
};

export default pointQuery;
