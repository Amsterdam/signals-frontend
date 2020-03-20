/* eslint-disable global-require */
import L from 'leaflet';

export const smallMarkerIcon = L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 19],
  className: 'sia-marker-small',
});

export const markerIcon = L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
  className: 'sia-map-marker',
});
