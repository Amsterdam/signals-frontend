/* eslint-disable global-require */
import L from 'leaflet';

export const DefaultLeafletIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png').default,
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default,
  shadowUrl: require('leaflet/dist/images/marker-shadow.png').default,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

export const AmsterdamMarkerIcon = L.icon({
  iconUrl: 'https://map.data.amsterdam.nl/dist/images/svg/marker.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 39],
});
