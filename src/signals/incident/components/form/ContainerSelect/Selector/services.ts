import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_LEVEL } from '@amsterdam/arm-core/lib/constants';

export const isLayerVisible = (zoom: number, zoomLevel: ZoomLevel): boolean => {
  const { min, max } = zoomLevel;
  return zoom <= (min ?? MIN_ZOOM_LEVEL) && zoom >= (max ?? MAX_ZOOM_LEVEL);
};

