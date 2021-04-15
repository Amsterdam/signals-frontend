// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types';
import { renderHook } from '@testing-library/react-hooks';
import '@amsterdam/react-maps';
import EventDispathcher from 'test/EventDispatcher';
import useLayerVisible, { isLayerVisible } from '../useLayerVisible';

const getZoomMock = jest.fn();
const eventDispatcher = new EventDispathcher();

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('@amsterdam/react-maps')!,
  useMapInstance: () => ({ getZoom: getZoomMock, off: jest.fn(), on: eventDispatcher.register }),
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
    eventDispatcher.events = {};
  });

  it('should return true when the layer is visible', () => {
    const zoomLevel: ZoomLevel = { max: 12 };
    const { result } = renderHook(() => useLayerVisible(zoomLevel));

    expect(result.current).toEqual(true);
  });

  it('should return false when layer is not visible', () => {
    const zoomLevel: ZoomLevel = { max: 12 };
    const { result } = renderHook(() => useLayerVisible(zoomLevel));
    expect(result.current).toEqual(true);

    getZoomMock.mockImplementation(() => 11);
    eventDispatcher.trigger('zoomend');

    expect(result.current).toEqual(false);

    getZoomMock.mockImplementation(() => 13);
    eventDispatcher.trigger('zoomend');
    expect(result.current).toEqual(true);
  });
});
