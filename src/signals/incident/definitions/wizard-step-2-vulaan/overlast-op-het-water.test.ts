// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import overlastOpHetWater from './overlast-op-het-water'

describe('definition overlast-op-het-water', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastOpHetWater)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_boten_drijfkracht',
      'extra_boten_vast',
      'extra_boten_lekken',
    ])
  })
})
