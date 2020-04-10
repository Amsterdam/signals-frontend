export const locationTofeature = location => ({
  type: 'Point',
  coordinates: [location.lng, location.lat],
});

export const featureTolocation = feature => {
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

export const centroideToLocation = centroide => {
  if (!centroide.includes('POINT')) {
    throw TypeError('Provided centroide geometry is not a point.');
  }
  const coordinate = centroide.split('(')[1].split(')')[0];
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

export const formatMapLocation = loc => {
  const value = {};

  if (loc.geometrie) {
    value.location = featureTolocation(loc.geometrie);
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
    : '';
  return display;
};

export const serviceResultToAddress = ({ straatnaam, huis_nlt, postcode, woonplaatsnaam }) => ({
  openbare_ruimte: straatnaam,
  huisnummer: huis_nlt,
  huisletter: '',
  huisnummertoevoeging: '',
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
  response.docs.map(result => {
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
