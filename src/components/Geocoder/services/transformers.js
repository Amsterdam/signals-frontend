export const wktPointToPointFeature = wktPoint => {
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
