// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { getFilteredIncidents } from './get-filtered-incidents'
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsWithoutIcon } from '../__test__/mock-incidents-without-icon'

describe('getFilteredIncidents', () => {
  it('should return only active incidents', () => {
    const result = getFilteredIncidents(
      mockFiltersShort,
      mockIncidentsWithoutIcon
    )

    expect(result.length).toEqual(3)
  })
})
