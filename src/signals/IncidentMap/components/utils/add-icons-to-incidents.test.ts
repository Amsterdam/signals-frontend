// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { addIconsToIncidents, getListOfIcons } from './add-icons-to-incidents'
import { mockFiltersShort } from '../__test__/mock-filters'
import { mockIncidentsWithoutIcon } from '../__test__/mock-incidents-without-icon'

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

const mockListOfIcons = [
  {
    slug: 'afval',
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
  },
  {
    slug: 'container-bijplaatsing',
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/afval.svg?temp_url_sig=6679c552c423eb18ffe55643e5692fb4c348bde4e2bde851f33a7aef8d0474fe&temp_url_expires=1665401494',
  },
  {
    slug: 'container-glas-kapot',
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/afval/container-glas-kapot/glas.svg?temp_url_sig=7b6c01926248bbb41d4de407f2e6a14f970d3d790ecc0d9ca6102bae2332e7c8&temp_url_expires=1665401494',
  },
  {
    slug: 'openbaar-groen-en-water',
    icon: 'https://ae70d54aca324d0480ca01934240c78f.objectstore.eu/signals/icons/categories/openbaar-groen-en-water/bomen_planten.svg?temp_url_sig=18c662680477047ec1edcb8c18bc67d4cfe6805fd129a5e6c1df5f84708df0b5&temp_url_expires=1665401494',
  },
]

describe('add-icons-to-incident', () => {
  describe('addIconsToIncidents', () => {
    it('should return incidents with correct icon', () => {
      const result = addIconsToIncidents(
        mockFiltersAllActive,
        mockIncidentsWithoutIcon,
        mockListOfIcons
      )

      expect(result[0].properties.icon).toMatch(/afval.svg/)
      expect(result[1].properties.icon).toMatch(/afval.svg/)
      expect(result[2].properties.icon).toMatch(/glas.svg/)
      // When subFilters are not enabled. All incidents in that category should get the icon of the main category.
      expect(result[3].properties.icon).toMatch(/bomen_planten.svg/)
    })

    it('should return icon undefined when main category does not have one', () => {
      const mockListOfIconsWithoutIcon = mockListOfIcons.map((iconObject) => {
        if (iconObject.slug === 'openbaar-groen-en-water') {
          return {
            slug: iconObject.slug,
          }
        } else return iconObject
      })

      const result = addIconsToIncidents(
        mockFiltersShort,
        mockIncidentsWithoutIcon,
        mockListOfIconsWithoutIcon
      )

      expect(result[0].properties.icon).toMatch(/afval.svg/)
      expect(result[1].properties.icon).toMatch(/afval.svg/)
      expect(result[3].properties.icon).toEqual(undefined)
    })
  })

  describe('getListOfIcons', () => {
    it('should return list of icons', () => {
      const result = getListOfIcons(mockFiltersShort)

      expect(result).toEqual(mockListOfIcons)
    })
  })
})
