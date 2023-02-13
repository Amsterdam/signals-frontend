// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { getMaxRange } from './get-max-range'

describe('getMaxRange', function () {
  it('should return the correct max range when innerWidth is 1400', function () {
    const expectedResult = 245.55555555555554
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1400,
    })

    expect(getMaxRange()).toEqual(expectedResult)
  })

  it('should return the correct max range when innerWidth is more than 1400', function () {
    const expectedResult = 245.55555555555554
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 2000,
    })

    expect(getMaxRange()).toEqual(expectedResult)
  })

  it('should return the correct max range when innerWidth is less than 1400', function () {
    const expectedResult = 156.66666666666666
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    })

    expect(getMaxRange()).toEqual(expectedResult)
  })
})
