import { getCrsRd } from '@datapunt/amsterdam-react-maps/lib/utils';

import configuration from 'shared/services/configuration/configuration';

const MAP_OPTIONS = {
  ...configuration.map.options || {},
  zoomControl: false,
  crs: getCrsRd(),
  attributionControl: true,
};

export default MAP_OPTIONS;
