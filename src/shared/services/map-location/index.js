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
