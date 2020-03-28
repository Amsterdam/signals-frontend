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

export const address2pdok = address => {
  const { openbare_ruimte, huisnummer, huisletter, huisnummer_toevoeging, postcode, woonplaats } = address;

  return {
    straatnaam: openbare_ruimte,
    huisnummer: `${huisnummer}`,
    huisletter: `${huisletter}` || '',
    huisnummertoevoeging: huisnummer_toevoeging ?   `${huisnummer_toevoeging}` : '',
    postcode,
    woonplaatsnaam: woonplaats,
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
    location.location = feature2location(loc.geometrie);
  }

  if (loc.buurt_code) {
    location.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeel) {
    location.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.address) {
    location.address = address2pdok(loc.address);
  }

  return location;
};

export default mapLocation;
