// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsShort } from '../__test__/mock-incidents'
import { computeIncidentsCountPerFilter } from './count-incidents-per-filter'

describe('computeincidentsCountPerFilter', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should add 1 to incidentsCount', () => {
    const mockFiltersOneItem = [
      {
        _display: 'Openbaar groen en water',
        filterActive: true,
        icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
        name: 'Openbaar groen en water',
        slug: 'openbaar-groen-en-water',
        incidentsCount: 0,
      },
    ]
    const result = computeIncidentsCountPerFilter(
      mockFiltersOneItem,
      mockIncidentsShort
    )

    expect(result[0].incidentsCount).toBe(1)
  })

  it("should add 1 to incidentsCount of mainCategoryFilter foreach of it's subCategories", () => {
    const result = computeIncidentsCountPerFilter(
      mockFiltersShort,
      mockIncidentsShort
    )

    expect(result[0].incidentsCount).toBe(3)
  })
})
