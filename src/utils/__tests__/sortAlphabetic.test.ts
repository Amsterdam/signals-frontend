// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { sortAlphabetic } from '../sortAlphabetic'

describe('sortAlphabetic', () => {
  it('should sort alphebetic', () => {
    expect(['b', 'c', 'a'].sort(sortAlphabetic)).toEqual(['a', 'b', 'c'])
  })
})
