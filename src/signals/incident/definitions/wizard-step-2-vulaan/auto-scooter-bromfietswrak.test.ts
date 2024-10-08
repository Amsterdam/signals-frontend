// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2024 Gemeente Amsterdam
import auto_scooter_bromfietswrak from './auto-scooter-bromfietswrak'

describe('definition auto-scooter-bromfietswrak', () => {
  it('has a defined set of controls', () => {
    const keys = Object.keys(auto_scooter_bromfietswrak)

    expect(keys).toStrictEqual(['locatie', 'auto_scooter_bromfietswrak'])
  })
})
