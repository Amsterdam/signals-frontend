// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { ZoomLevel } from '@amsterdam/arm-core/lib/types'
import { act, renderHook } from '@testing-library/react-hooks'
import '@amsterdam/react-maps'
import EventDispathcher from 'test/EventDispatcher'
import useLayerVisible, { isLayerVisible } from '../useLayerVisible'

const mockGetZoom = jest.fn()
const mockEventDispatcher = new EventDispathcher()

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  ...jest.requireActual('@amsterdam/react-maps')!,
  useMapInstance: () => ({
    getZoom: mockGetZoom,
    off: jest.fn(),
    on: mockEventDispatcher.register,
  }),
}))

describe('isLayerVisible', () => {
  it('should return the layer visibility', () => {
    expect(isLayerVisible(11, { max: 10, min: 12 })).toBe(true)
    expect(isLayerVisible(9, { max: 10, min: 12 })).toBe(false)
    expect(isLayerVisible(9, { min: 12 })).toBe(true)
    expect(isLayerVisible(13, { min: 12 })).toBe(false)
    expect(isLayerVisible(13, { max: 10, min: 12 })).toBe(false)
    expect(isLayerVisible(13, { max: 10 })).toBe(true)
    expect(isLayerVisible(9, { max: 10 })).toBe(false)
  })
})

describe('useLayerVisible', () => {
  beforeEach(() => {
    mockGetZoom.mockReset()
    mockEventDispatcher.events = {}
  })

  it('should return true when the layer is visible', () => {
    const zoomLevel: ZoomLevel = { max: 12 }
    mockGetZoom.mockImplementation(() => 13)
    const { result } = renderHook(() => useLayerVisible(zoomLevel))

    expect(result.current).toEqual(true)
  })

  it('should return false when layer is not visible', () => {
    const zoomLevel: ZoomLevel = { max: 12 }
    const { result } = renderHook(() => useLayerVisible(zoomLevel))
    expect(result.current).toEqual(false)

    mockGetZoom.mockImplementation(() => 11)
    act(() => {
      mockEventDispatcher.trigger('zoomend')
    })

    expect(result.current).toEqual(false)

    mockGetZoom.mockImplementation(() => 13)
    act(() => {
      mockEventDispatcher.trigger('zoomend')
    })
    expect(result.current).toEqual(true)
  })
})
