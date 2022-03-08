import { act, renderHook } from '@testing-library/react-hooks'

import EventDispathcher from 'test/EventDispatcher'

import useBoundingBox from './useBoundingBox'

const east = 4.899032528058569
const north = 52.36966337175116
const south = 52.36714374096002
const west = 4.8958566562555035

const mockGetBounds = jest.fn(() => ({
  getEast: () => east,
  getNorth: () => north,
  getSouth: () => south,
  getWest: () => west,
}))

const mockEventDispatcher = new EventDispathcher()
const mockUseMapInstance = {
  getBounds: mockGetBounds,
  off: jest.fn(),
  on: mockEventDispatcher.register,
}

jest.mock('@amsterdam/react-maps', () => ({
  __esModule: true,
  ...jest.requireActual('@amsterdam/react-maps'),
  useMapInstance: jest.fn(() => mockUseMapInstance),
}))

describe('useBoundingBox', () => {
  beforeEach(() => {
    // jest.spyOn(reactMaps, 'useMapInstance').mockReturnValue(mockUseMapInstance)
    mockEventDispatcher.events = {}
  })

  it('returns a bounding box on hook instantiation', () => {
    const { result } = renderHook(() => useBoundingBox())

    expect(result.current).toStrictEqual({
      east: east.toString(),
      north: north.toString(),
      south: south.toString(),
      west: west.toString(),
    })
  })

  it('returns a bounding box on map moveend event', () => {
    const newEast = 4.8582258311491255
    const newNorth = 52.38563686750379
    const newSouth = 52.383116151840426
    const newWest = 4.8550511417925355

    const newBounds = {
      getEast: () => newEast,
      getNorth: () => newNorth,
      getSouth: () => newSouth,
      getWest: () => newWest,
    }

    const { result } = renderHook(() => useBoundingBox())

    // Disabling linter; only mocking parts of map instance that we need here
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockGetBounds.mockReturnValue(newBounds)

    act(() => {
      mockEventDispatcher.trigger('moveend')
    })

    expect(result.current).toStrictEqual({
      east: newEast.toString(),
      north: newNorth.toString(),
      south: newSouth.toString(),
      west: newWest.toString(),
    })
  })
})
