import {
  selectionIsObject,
  selectionIsUndetermined,
  selectionIsNearby,
  UNKNOWN_TYPE,
  UNREGISTERED_TYPE,
  NEARBY_TYPE,
} from './constants'

describe('Mapselectors constants', () => {
  it('returns a boolean for selectionIsObject', () => {
    expect(selectionIsObject({ type: UNKNOWN_TYPE })).toStrictEqual(false)
    expect(selectionIsObject({ type: UNREGISTERED_TYPE })).toStrictEqual(false)
    expect(selectionIsObject({ type: NEARBY_TYPE })).toStrictEqual(false)
    expect(selectionIsObject({ type: 'something else' })).toStrictEqual(true)
  })

  it('returns a boolean for selectionIsUndetermined', () => {
    expect(selectionIsUndetermined({ type: UNKNOWN_TYPE })).toStrictEqual(true)
    expect(selectionIsUndetermined({ type: UNREGISTERED_TYPE })).toStrictEqual(
      true
    )
    expect(selectionIsUndetermined({ type: NEARBY_TYPE })).toStrictEqual(true)
    expect(selectionIsUndetermined({ type: 'something else' })).toStrictEqual(
      false
    )
  })

  it('returns a boolean for selectionIsNearby', () => {
    expect(selectionIsNearby({ type: UNKNOWN_TYPE })).toStrictEqual(false)
    expect(selectionIsNearby({ type: UNREGISTERED_TYPE })).toStrictEqual(false)
    expect(selectionIsNearby({ type: NEARBY_TYPE })).toStrictEqual(true)
    expect(selectionIsNearby({ type: 'something else' })).toStrictEqual(false)
  })
})
