import { getCrsRd } from '@datapunt/amsterdam-react-maps/lib/utils';

const MAP_OPTIONS = {
  center: [52.3731081, 4.8932945],
  zoomControl: false,
  zoom: 10,
  crs: getCrsRd(),
  maxBounds: [
    [52.25168, 4.64034],
    [52.50536, 5.10737],
  ],
  attributionControl: true,
};

export default MAP_OPTIONS;
