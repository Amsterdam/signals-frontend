export const location2feature = location => ({
  type: 'Point',
  coordinates: [location.lng, location.lat],
});

export const feature2location = feature => {
  const { coordinates } = feature;
  return {
    lat: coordinates[1],
    lng: coordinates[0],
  };
};

export const wktPointToLocation = wktPoint => {
  if (!wktPoint.includes('POINT')) {
    throw TypeError('Provided WKT geometry is not a point.');
  }
  const coordinate = wktPoint.split('(')[1].split(')')[0];
  const lat = parseFloat(coordinate.split(' ')[1]);
  const lng = parseFloat(coordinate.split(' ')[0]);

  return {
    lat,
    lng,
  };
};

/**
 * converts the location from `sia` location format to latlon format
 */
const mapLocation = loc => {
  const value = {};

  if (loc.geometrie) {
    value.geometrie = loc.geometrie;
  }

  if (loc.buurt_code) {
    value.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeel) {
    value.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.address) {
    value.address = loc.address;
  }
  return value;
};

export const formatMapLocation = loc => {
  const value = {};

  if (loc.geometrie) {
    value.location = feature2location(loc.geometrie);
  }

  if (loc.address) {
    const { openbare_ruimte, huisnummer, postcode, woonplaats } = loc.address;
    value.addressText = `${openbare_ruimte} ${huisnummer}, ${postcode} ${woonplaats}`;
    value.address = loc.address;
  }

  return value;
};

export const formatAddress = address => {
  const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
  const display = address.openbare_ruimte
    ? `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`
    : '_';
  return display;
};

export const serviceResult2Address = ({ straatnaam_verkort, huis_nlt, postcode, woonplaatsnaam }) => ({
  openbare_ruimte: straatnaam_verkort,
  huisnummer: huis_nlt,
  huisletter: '',
  huisnummertoevoeging: '',
  postcode,
  woonplaats: woonplaatsnaam,
});

export const serviceAttributes = [
  'id',
  'weergavenaam',
  'straatnaam_verkort',
  'huis_nlt',
  'postcode',
  'woonplaatsnaam',
  'centroide_ll',
];

export const formatResponse = ({ response }) =>
  response.docs.map(result => {
    const { id, weergavenaam, centroide_ll } = result;
    return {
      id,
      value: weergavenaam,
      data: {
        location: wktPointToLocation(centroide_ll),
        address: serviceResult2Address(result),
      },
    };
  });

export default mapLocation;
