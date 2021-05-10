// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import convertValue from '.'

describe('The convert value service', () => {
  it('should return undefined by default', () => {
    expect(convertValue()).toBeUndefined()
  })

  it('should return text', () => {
    expect(convertValue('This is a beautiful phrase')).toBe(
      'This is a beautiful phrase'
    )
  })

  it('should return 0', () => {
    expect(convertValue(0)).toBe(0)
  })

  it('should return "ja"', () => {
    expect(convertValue(true)).toBe('ja')
  })

  it('should return "nee"', () => {
    expect(convertValue(false)).toBe('nee')
  })

  it('should pass through an array', () => {
    const array = [42, 'foo', 'bar']
    expect(convertValue(array)).toBe(array)
  })

  it('should pass through an array', () => {
    const object = {
      foo: 1,
      bar: {
        x: 42,
        y: 42,
      },
    }
    expect(convertValue(object)).toBe(object)
  })
})
