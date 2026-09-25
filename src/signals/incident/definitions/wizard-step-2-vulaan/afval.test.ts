// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import afval from './afval'

describe('definition afval', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afval)

    expect(keys).toStrictEqual(['locatie', 'dateTime'])
  })
})
