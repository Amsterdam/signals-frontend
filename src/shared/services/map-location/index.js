/**
 * converts the amaps geocoder location in sia fromat
 */
function mapLocation(loc) {
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
    location.stadsdeel = loc.omgevingsinfo.stadsdeelcode;
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

export default mapLocation;
