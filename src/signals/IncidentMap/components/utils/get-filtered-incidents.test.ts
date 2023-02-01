// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import { getFilteredIncidents } from './get-filtered-incidents'
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsWithoutIcon } from '../__test__/mock-incidents-without-icon'

jest.mock('shared/services/configuration/configuration')

const mockFiltersAllActive = mockFiltersShort.map((filter) => {
  if (filter.subCategories) {
    return {
      ...filter,
      filterActive: true,
      subCategories: filter.subCategories.map((subFilter) => {
        return {
          ...subFilter,
          filterActive: true,
        }
      }),
    }
  }

  return {
    ...filter,
    filterActive: true,
  }
})

describe('getFilteredIncidents', () => {
  beforeEach(() => {
    configuration.map.optionsIncidentMap.hasSubfiltersEnabled = [
      'afval',
      'wegen-verkeer-straatmeubilair',
    ]
  })

  it('should return only active incidents', () => {
    const result = getFilteredIncidents(
      mockFiltersShort,
      mockIncidentsWithoutIcon
    )

    expect(result.length).toEqual(3)
  })

  it('should return incidents with correct icon', () => {
    const result = getFilteredIncidents(
      mockFiltersAllActive,
      mockIncidentsWithoutIcon
    )

    expect(result[0].properties.icon).toMatch(/afval.svg/)
    expect(result[1].properties.icon).toMatch(/afval.svg/)
    expect(result[2].properties.icon).toMatch(/glas.svg/)
    // When subFilters are not enabled. All incidents in that category should get the icon of the main category.
    expect(result[3].properties.icon).toMatch(/bomen_planten.svg/)
  })

  it('should return icon undefined when main category does not have one', () => {
    const mockFiltersWithoutIcon = [
      mockFiltersShort[0],
      { ...mockFiltersShort[1], icon: undefined },
    ]

    const result = getFilteredIncidents(
      mockFiltersWithoutIcon,
      mockIncidentsWithoutIcon
    )

    expect(result[0].properties.icon).toMatch(/afval.svg/)
    expect(result[1].properties.icon).toMatch(/afval.svg/)
    expect(result[2].properties.icon).toEqual(undefined)
  })
})
