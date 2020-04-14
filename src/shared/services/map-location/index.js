export const locationTofeature = location => ({
  type: 'Point',
  coordinates: [location.lng, location.lat],
});

export const featureTolocation = ({ coordinates }) => ({
  lat: coordinates[1],
  lng: coordinates[0],
});

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
export const mapLocation = loc => {
  const value = {};

  if (loc.geometrie) {
    value.geometrie = loc.geometrie;
  }

  if (loc.buurt_code) {
    value.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeel) {
    value.stadsdeel = loc.stadsdeel;
  }

  if (loc.address) {
    value.address = loc.address;
  }
  return value;
};

const getAddressText = ({ openbare_ruimte, huisnummer, postcode, woonplaats }) =>
  [
    [openbare_ruimte, huisnummer],
    [postcode, woonplaats],
  ]
    .flatMap(parts => parts.filter(Boolean).join(' '))
    .filter(Boolean)
    .join(', ');

/**
 * Converts a location and address to values
 *
 * @param {Object} location
 * @param {Object} location.geometrie
 * @param {String} location.geometrie.type
 * @param {Number[]} location.geometrie.coordinates
 * @param {Object} location.address
 * @param {String} location.address.openbare_ruimte
 * @param {String} location.address.huisnummer
 * @param {String} location.address.huisletter
 * @param {String} location.address.huisnummertoevoeging
 * @param {String} location.address.postcode
 * @param {String} location.address.woonplaats
 * @returns {Object}
 */
export const formatMapLocation = location => {
  const value = {};

  if (location.geometrie) {
    value.location = featureTolocation(location.geometrie);
  }

  if (location.address) {
    value.addressText = getAddressText(location.address);
    value.address = location.address;
  }

  return value;
};

export const formatAddress = address => getAddressText(address);

export const serviceResultToAddress = ({ straatnaam, huis_nlt, postcode, woonplaatsnaam }) => ({
  openbare_ruimte: straatnaam,
  huisnummer: huis_nlt,
  postcode,
  woonplaats: woonplaatsnaam,
});

export const pdokResponseFieldList = [
  'id',
  'weergavenaam',
  'straatnaam',
  'huis_nlt',
  'postcode',
  'woonplaatsnaam',
  'centroide_ll',
];

export const formatPDOKResponse = ({ response }) =>
  response.docs?.map(result => {
    const { id, weergavenaam, centroide_ll } = result;
    return {
      id,
      value: weergavenaam,
      data: {
        location: wktPointToLocation(centroide_ll),
        address: serviceResultToAddress(result),
      },
    };
  });
