// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import verkeersoverlast from './verkeersoverlast'

describe('definition verkeersoverlast', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(verkeersoverlast)

    expect(keys).toStrictEqual(['locatie', 'dateTime'])
  })
})
