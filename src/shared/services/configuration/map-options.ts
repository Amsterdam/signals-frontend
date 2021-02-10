import { getCrsRd } from '@amsterdam/arm-core';
import type { MapOptions } from 'leaflet';

import configuration from 'shared/services/configuration/configuration';

const MAP_OPTIONS: MapOptions = {
  ...(configuration?.map.options as MapOptions),
  attributionControl: true,
  crs: getCrsRd(),
  zoomControl: false,
};

export default MAP_OPTIONS;
