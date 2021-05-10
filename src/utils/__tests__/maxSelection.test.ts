// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import MaxSelection from '../maxSelection'

describe('maxSelection', () => {
  let selection: MaxSelection<number>

  beforeEach(() => {
    selection = new MaxSelection(3)
  })

  it('should be empty on init', () => {
    expect(selection.set).toEqual(new Set())
  })

  it('should allow initial array', () => {
    selection = new MaxSelection<number>(3, [42])
    expect(selection.set).toEqual(new Set([42]))
  })

  it('should add elements', () => {
    selection.add(42)
    selection.add(9)

    expect(selection.set).toEqual(new Set([42, 9]))
  })

  it('should add no more than max', () => {
    selection.add(1)
    selection.add(2)
    selection.add(3)
    selection.add(5)

    expect(selection.set).toEqual(new Set([1, 2, 3]))
  })

  it('should check if an element is present', () => {
    selection.add(42)

    expect(selection.has(42)).toEqual(true)
  })

  it('should delete an element', () => {
    selection.add(42)

    selection.delete(42)

    expect(selection.set).toEqual(new Set([]))
  })

  it('should toggle an element', () => {
    selection.toggle(42)
    expect(selection.set).toEqual(new Set([42]))

    selection.toggle(42)
    expect(selection.set).toEqual(new Set())
  })
})
