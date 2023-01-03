// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsShort } from '../__test__/mock-incidents'
import { getFilteredIncidents } from './get-filtered-incidents'

describe('getFilteredIncidents', () => {
  it('should return only active incidents', () => {
    const result = getFilteredIncidents(mockFiltersShort, mockIncidentsShort)

    expect(result.length).toEqual(3)
  })
})
