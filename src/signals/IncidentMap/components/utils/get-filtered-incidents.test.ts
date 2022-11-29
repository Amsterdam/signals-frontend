// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsShort } from '../__test__/mock-incidents'
import { getFilteredIncidents } from './get-filtered-incidents'

describe('getFilteredIncidents', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should return only active filters', () => {
    const result = getFilteredIncidents(mockFiltersShort, mockIncidentsShort)

    expect(result.length).toEqual(4)
  })
  it('should return only active filters with the first without icon', () => {
    const filters = mockFiltersShort.map(removeIcons)
    const result = getFilteredIncidents(filters, mockIncidentsShort)

    expect(result.length).toEqual(4)
  })
})

const removeIcons = (feature: any) => {
  const f = { ...feature, icon: '' }
  if (f.subCategories) {
    f.subCategories = f.subCategories?.map(removeIcons)
  }
  return f
}
