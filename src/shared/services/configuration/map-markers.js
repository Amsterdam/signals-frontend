/* eslint-disable global-require */
import L from 'leaflet';

export const smallMarkerIcon = global.window.L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [20, 20],
  iconAnchor: [10, 19],
});

export const markerIcon = L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
});
