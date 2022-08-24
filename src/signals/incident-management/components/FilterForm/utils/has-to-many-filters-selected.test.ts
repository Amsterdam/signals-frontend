// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import { hasTooManyFiltersSelected } from './has-to-many-filters-selected'

jest.mock('./constants', () => ({
  ...jest.requireActual('./constants'),
  MAX_FILTER_LENGTH: 100,
}))

const storedParamsMock = {
  page: 1,
  ordering: '-created_at',
  page_size: 50,
}

const selectedFiltersMock = {
  category_slug: ['asbest-accu', 'boom', 'boom-illegale-kap'],
  status: ['m'],
}

describe('hasTooManyFiltersSelected', () => {
  it('should return true when too many filters are selected and the requestUrl will be too long', () => {
    expect(
      hasTooManyFiltersSelected(storedParamsMock, selectedFiltersMock)
    ).toEqual(true)
  })

  it('should return false when requestUrl does not exceed threshold', () => {
    expect(hasTooManyFiltersSelected(storedParamsMock, {})).toEqual(false)
  })
})
