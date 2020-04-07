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
    huisnummertoevoeging: huisnummer_toevoeging ? `${huisnummer_toevoeging}` : '',
    postcode,
    woonplaatsnaam: woonplaats,
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
const mapLocation = loc => {
  const location = {};

  if (loc.dichtstbijzijnd_adres) {
    location.address = { ...loc.dichtstbijzijnd_adres };
    location.address.huisnummer = `${location.address.huisnummer}`;
    location.address.huisnummer_toevoeging = `${location.address.huisnummer_toevoeging}`;
  }

  if (loc.omgevingsinfo) {
    location.buurt_code = loc.omgevingsinfo.buurtcode;
    location.stadsdeel = loc.omgevingsinfo.stadsdeelcode;
  }

  if (loc.query) {
    location.geometrie = {
      type: 'Point',
      coordinates: [loc.query.longitude, loc.query.latitude],
    };
  }

  return location;
};
export const formatAddress = address => {
  const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
  const display = address.openbare_ruimte
    ? `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`
    : '_';
  return display;
};

export default mapLocation;
