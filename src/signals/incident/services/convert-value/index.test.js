// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import convertValue from '.'

describe('The convert value service', () => {
  it('returnd undefined by default', () => {
    expect(convertValue()).toBeUndefined()
  })

  it('returns a string', () => {
    expect(convertValue('This is a beautiful phrase')).toBe(
      'This is a beautiful phrase'
    )
  })

  it('returns 0', () => {
    expect(convertValue(0)).toStrictEqual(0)
  })

  it('returns "ja" for a truthy value', () => {
    expect(convertValue(true)).toStrictEqual('ja')
  })

  it('returns "nee" for a falsy value', () => {
    expect(convertValue(false)).toStrictEqual('nee')
  })

  it('returns selection prop from object', () => {
    const selection = {
      foo: 'bar',
    }
    const value = {
      selection,
    }

    expect(convertValue(value)).toStrictEqual(selection)
  })

  it('does not convert array values', () => {
    const array = [42, 'foo', 'bar']
    expect(convertValue(array)).toStrictEqual(array)
  })

  it('does not convert object values', () => {
    const object = {
      foo: 1,
      bar: {
        x: 42,
        y: 42,
      },
    }
    expect(convertValue(object)).toStrictEqual(object)
  })
})
