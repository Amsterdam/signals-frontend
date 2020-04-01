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

export const parseAdressText = address => {
  const [openbare_ruimte, postcodeWoonplaats] = address.split(', ');
  const [postcode, woonplaats] = postcodeWoonplaats.split(' ');

  return {
    openbare_ruimte ,
    huisnummer: '',
    huisletter: '',
    huisnummertoevoeging: '',
    postcode,
    woonplaats,
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
  const location = {};

  if (loc.geometrie) {
    location.geometrie = loc.geometrie;
  }

  if (loc.buurt_code) {
    location.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeel) {
    location.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.addressText) {
    location.address = parseAdressText(loc.addressText);
  }

  return location;
};

export const formatMapLocation = loc => {
  const value = {};

  if (loc.geometrie) {
    value.location = feature2location(loc.geometrie);
  }

  if (loc.address) {
    const { openbare_ruimte, postcode, woonplaats } = loc.address;
    value.addressText = `${openbare_ruimte}, ${postcode} ${woonplaats}`;
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

export default mapLocation;
