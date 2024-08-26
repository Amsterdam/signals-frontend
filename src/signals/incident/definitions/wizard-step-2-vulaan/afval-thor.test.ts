// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2024 Gemeente Amsterdam
import afvalThor from './afval-thor'

describe('definition afvalThor', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afvalThor)

    expect(keys).toStrictEqual([
      'locatie',
      'dateTime',
      'extra_afval_handhaving',
      'extra_afval_handhaving_owner',
      'extra_afval_handhaving_owner_confirmation',
    ])
  })
})
