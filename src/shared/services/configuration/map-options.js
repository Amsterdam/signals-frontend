import { getCrsRd } from '@amsterdam/arm-core';

import configuration from 'shared/services/configuration/configuration';

const MAP_OPTIONS = {
  ...configuration.map.options,
  attributionControl: true,
  crs: getCrsRd(),
  zoomControl: false,
};

export default MAP_OPTIONS;
