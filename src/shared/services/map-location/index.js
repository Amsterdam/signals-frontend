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
      coordinates: [
        loc.query.longitude,
        loc.query.latitude,
      ],
    };
  }

  return location;
}

export default mapLocation;
