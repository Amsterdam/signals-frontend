import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import { renderHook } from '@testing-library/react-hooks';
import useLayerVisible, { isLayerVisible } from '../useLayerVisible';


describe('isLayerVisible', () => {
  it('should return the layer visibility', () => {
    expect(isLayerVisible(11, { max: 10, min: 12 })).toBe(true);
    expect(isLayerVisible(9, { max: 10, min: 12 })).toBe(false);
    expect(isLayerVisible(9, { min: 12 })).toBe(true);
    expect(isLayerVisible(13, { min: 12 })).toBe(false);
    expect(isLayerVisible(13, { max: 10, min: 12 })).toBe(false);
    expect(isLayerVisible(13, { max: 10 })).toBe(true);
    expect(isLayerVisible(9, { max: 10 })).toBe(false);
  });
});

describe('useLayerVisible', () => {
  it('should return a boolean', () => {
    const zoomLevel: ZoomLevel = { max: 12 };
    const { result } = renderHook(() => useLayerVisible(zoomLevel));

    expect(result.current).toEqual(true);
  });
});

