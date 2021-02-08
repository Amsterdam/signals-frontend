import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import { renderHook } from '@testing-library/react-hooks';
import '@amsterdam/react-maps';
import useLayerVisible, { isLayerVisible } from '../useLayerVisible';


const getZoomMock = jest.fn();

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...(jest.requireActual('@amsterdam/react-maps'))!,
  useMapInstance: () => ({
    getZoom: getZoomMock,
    off: jest.fn(),
    on: jest.fn(),
  }),
}));

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
  beforeEach(() => {
    getZoomMock.mockReset();
  });

  it('should return a boolean', () => {
    const zoomLevel: ZoomLevel = { max: 12 };
    const { result } = renderHook(() => useLayerVisible(zoomLevel));

    expect(result.current).toEqual(true);
  });
});
