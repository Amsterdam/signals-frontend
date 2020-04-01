import proj4 from 'proj4';

proj4.defs(
  'EPSG:28992',
  `+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs`
);

export const transformCoords = proj4('EPSG:4326', 'EPSG:28992');
export const serviceURL =
    'http://geodata.nationaalgeoregister.nl/locatieserver/revgeo?type=adres&rows=1';

function formatRequest(baseUrl, xy, distance = 50) {
  const xyRD = transformCoords.forward(xy);
  return `${baseUrl}&X=${xyRD.x}&Y=${xyRD.y}&distance=${distance}`;
}

const reverseGeocoderService = async location => {
  const xy = {
    x: location.lng,
    y: location.lat,
  };
  const url = formatRequest(serviceURL, xy);
  const result = await fetch(url);
  const data =  await result.json();
  return data?.response?.docs[0]?.weergavenaam || '';
};

export default reverseGeocoderService;
