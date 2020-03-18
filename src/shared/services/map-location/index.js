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

/**
 * converts the location from `sia` location format to latlon format
 */
export function mapLocation(loc) {
  const location = {};

  if (loc.geometrie) {
    location.location = feature2location(loc.geometrie);
  }

  if (loc.buurt_code) {
    location.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeelcode) {
    location.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.address) {
    location.address = address2pdok(loc.address);
  }

  return location;
}

export const pdok2address = pdokAddress => {
  const {
    straatnaam,
    huisnummer,
    huisletter,
    huisnummertoevoeging,
    postcode,
    woonplaatsnaam,
  } = pdokAddress;

  return {
    openbare_ruimte: straatnaam,
    huisnummer: `${huisnummer}`,
    huisletter: huisletter || '',
    huisnummer_toevoeging: huisnummertoevoeging || '',
    postcode,
    woonplaats: woonplaatsnaam,
  };
};

export const address2pdok = address => {
  const {
    openbare_ruimte,
    huisnummer,
    huisletter,
    huisnummer_toevoeging,
    postcode,
    woonplaats,
  } = address;

  return {
    straatnaam: openbare_ruimte,
    huisnummer: `${huisnummer}`,
    huisletter: huisletter || '',
    huisnummertoevoeging: huisnummer_toevoeging || '',
    postcode,
    woonplaatsnaam: woonplaats,
  };
};

/**
 * converts the geocoder location in sia format
 */
export const getLocation = loc => {
  const location = {};

  if (loc.location) {
    location.geometrie = location2feature(loc.location);
  }

  if (loc.buurtcode) {
    location.buurt_code = loc.buurtcode;
  }

  if (loc.stadsdeel) {
    location.stadsdeel = loc.stadsdeelcode;
  }

  if (loc.address) {
    location.address = pdok2address(loc.address);
  }

  return location;
};

export const formatAddress = address => {
  const toevoeging = address.huisnummer_toevoeging
    ? `-${address.huisnummer_toevoeging}`
    : '';
  const display = address.openbare_ruimte
    ? `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`
    : '_';
  return display;
};

export default mapLocation;
