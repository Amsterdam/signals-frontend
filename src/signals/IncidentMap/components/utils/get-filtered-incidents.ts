// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { Filter, Incident } from '../../types'
/*
When mainCategory is checked, all incidents on the map needs to be shown except for those incidents where the subCategory
of the maintCategory is unchecked.
 */
export const getFilteredIncidents = (
  filters: Filter[],
  incidents: Incident[]
): Incident[] => {
  const activeFilters = filters.reduce((acc: Filter[], filter) => {
    if (filter.filterActive) {
      acc.push(filter)
      if (filter.subCategories) {
        filter.subCategories.forEach((subCategory) => {
          if (subCategory.filterActive) {
            acc.push(subCategory)
          }
        })
      }
    }
    return acc
  }, [])

  const activeSlugs = activeFilters.map((filter) => filter.slug)

  const activeIncidents = incidents.filter((incident) => {
    return activeSlugs.includes(incident.properties.category.slug)
  })

  const listedIcons = getListOfIcons(activeFilters)

  return activeIncidents.map((incident) => {
    const slug = incident.properties.category.slug

    const icon = listedIcons.find((iconObj) => iconObj.slug === slug)
    if (icon?.icon) {
      return {
        ...incident,
        properties: {
          ...incident.properties,
          icon: icon.icon,
        },
      }
    }
    return incident
  })
}

interface Icon {
  slug: string
  icon?: string
}

const getListOfIcons = (filters: Filter[]) => {
  const allFilters = filters.reduce((acc: Filter[], filter: Filter) => {
    acc.push(filter)
    if (filter.subCategories) {
      acc.push(...filter.subCategories)
    }
    return acc
  }, [])

  return allFilters.map(createIcon)
}

const createIcon = (category: Filter): Icon => ({
  slug: category.slug,
  icon: category.icon,
})
