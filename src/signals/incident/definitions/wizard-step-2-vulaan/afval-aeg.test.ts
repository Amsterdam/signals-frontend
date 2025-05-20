// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import afvalAEG from './afval-aeg'

describe('definition afvalAEG', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(afvalAEG)

    expect(keys).toStrictEqual(['locatie', 'extra_wanneer', 'extra_afval'])
  })
})
