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
    huisletter: huisletter || '',
    huisnummertoevoeging: huisnummer_toevoeging ? String(huisnummer_toevoeging) : '',
    postcode,
    woonplaatsnaam: woonplaats,
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

  if (loc.stadsdeel) {
    location.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.address) {
    location.address = address2pdok(loc.address);
  }

  return location;
}

export const formatAddress = address => {
  const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
  const display = address.openbare_ruimte
    ? `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`
    : '_';
  return display;
};

export default mapLocation;
