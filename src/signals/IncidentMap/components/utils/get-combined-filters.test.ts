// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { getCombinedFilters } from './get-combined-filters'
import { mockFiltersShort } from '../__test__'

describe('getCombinedFilters', function () {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should return active filter of main category and its subs', function () {
    expect(
      getCombinedFilters(mockFiltersShort[0], mockFiltersShort).length
    ).toEqual(3)
  })
  it('should return just a sub category', function () {
    expect(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getCombinedFilters(mockFiltersShort[0].subCategories[1], mockFiltersShort)
        .length
    ).toEqual(1)
  })
  it('should return sub and its main category', function () {
    mockFiltersShort[0].filterActive = false
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockFiltersShort[0].subCategories = mockFiltersShort[0].subCategories.map(
      (c) => ({ ...c, filterActive: false })
    )
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(
      getCombinedFilters(mockFiltersShort[0].subCategories[0], mockFiltersShort)
        .length
    ).toEqual(2)
  })
})
