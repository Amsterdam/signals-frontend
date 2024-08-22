// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import overlastOpHetWater from './overlast-op-het-water'

describe('definition overlast-op-het-water', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(overlastOpHetWater)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'dateTime_Thor',
      'extra_boten_frequentie',
      'extra_boten_moment',
      'extra_boten_beweging',
      'extra_boten_soort',
      'extra_boten_open_gesloten',
      'extra_boten_drijfkracht',
      'extra_boten_vast',
      'extra_boten_lekken',
      'extra_boten_meer',
    ])
  })
})
