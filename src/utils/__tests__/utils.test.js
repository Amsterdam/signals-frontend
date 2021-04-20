// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { isArray, isDate } from '..'

const date = new Date()
const nr = Date.now()
const str = 'foo bar'
const bool = false
const undef = undefined
const nill = null
const array = ['a', 0, null]
const obj = { a: 'a', 0: 0, nill: null }
const array2 = new Array(2)
const array3 = [['a'], ['b']]

describe('isArray', () => {
  it('should return a boolean', () => {
    expect(isArray(nr)).toEqual(false)
    expect(isArray(date)).toEqual(false)
    expect(isArray(str)).toEqual(false)
    expect(isArray(bool)).toEqual(false)
    expect(isArray(undef)).toEqual(false)
    expect(isArray(nill)).toEqual(false)
    expect(isArray(obj)).toEqual(false)

    expect(isArray(array2)).toEqual(true)
    expect(isArray(array)).toEqual(true)
  })
})

describe('isDate', () => {
  it('should return a boolean', () => {
    expect(isDate(nr)).toEqual(false)
    expect(isDate(str)).toEqual(false)
    expect(isDate(bool)).toEqual(false)
    expect(isDate(undef)).toEqual(false)
    expect(isDate(nill)).toEqual(false)
    expect(isDate(array2)).toEqual(false)
    expect(isDate(array)).toEqual(false)
    expect(isDate(obj)).toEqual(false)
    expect(isDate(array3)).toEqual(false)

    expect(isDate('2019-09-17')).toEqual(true)
  })
})
