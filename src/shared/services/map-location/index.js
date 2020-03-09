/**
 * converts the sia location in geocoder fromat
 */
function mapLocation(loc) {
  const location = {};

  if (loc.geometrie) {
    const { coordinates } = loc.geometrie;
    location.location = {
      lng: coordinates[0],
      lat: coordinates[1],
    };
  }

  if (loc.buurt_code) {
    location.buurtcode = loc.buurt_code;
  }

  if (loc.stadsdeelcode) {
    location.stadsdeelcode = loc.stadsdeel;
  }

  if (loc.address) {
    const {
      openbare_ruimte,
      huisnummer,
      huisletter,
      huisnummer_toevoeging,
      postcode,
      woonplaats,
      address_text,
    } = loc.address;

    location.address = {
      straatnaam: openbare_ruimte,
      huisnummer: `${huisnummer}`,
      huisletter: huisletter || '',
      huisnummertoevoeging: huisnummer_toevoeging || '',
      postcode,
      woonplaatsnaam: woonplaats,
      address_text,
    };
  }

  return location;
}

/**
 * converts the geocoder location in sia fromat
 */
export const getLocation = loc => {
  const location = {};

  if (loc.location) {
    location.geometrie = {
      type: 'Point',
      coordinates: [loc.location.lng, loc.location.lat],
    };
  }

  if (loc.buurtcode) {
    location.buurt_code = loc.buurtcode;
  }

  if (loc.stadsdeel) {
    location.stadsdeel = loc.stadsdeelcode;
  }

  if (loc.address) {
    const {
      straatnaam,
      huisnummer,
      huisletter,
      huisnummertoevoeging,
      postcode,
      woonplaatsnaam,
    } = loc.address;

    location.address = {
      openbare_ruimte: straatnaam,
      huisnummer: `${huisnummer}`,
      huisletter: huisletter || '',
      huisnummer_toevoeging: huisnummertoevoeging || '',
      postcode,
      woonplaats: woonplaatsnaam,
    };
  }

  return location;
};


export const formatAddress = address => {
  const toevoeging = address.huisnummer_toevoeging ? `-${address.huisnummer_toevoeging}` : '';
  const display = `${address.openbare_ruimte} ${address.huisnummer}${address.huisletter}${toevoeging}, ${address.postcode} ${address.woonplaats}`;
  return display;
};


export default mapLocation;
