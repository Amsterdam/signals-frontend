// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 -2023 Gemeente Amsterdam
import type { Filter, Incident, Icon } from '../../types'
import { showSubCategoryFilter } from '../FilterPanel/utils'

export const addIconsToIncidents = (
  filters: Filter[],
  incidents: Incident[],
  listedIcons: Icon[]
) => {
  const mainCategoriesWithSub = filters
    .filter((filter) => filter.show_children_in_filter)
    .map((filter) => filter.slug)

  return incidents.map((incident) => {
    const hasSubFiltersEnabled = showSubCategoryFilter(
      mainCategoriesWithSub,
      incident.properties.category.parent.slug
    )

    const slug = hasSubFiltersEnabled
      ? incident.properties.category.slug
      : incident.properties.category.parent.slug

    const icon = listedIcons.find((iconObj) => {
      return iconObj.slug === slug
    })
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

export const getListOfIcons = (filters: Filter[]) => {
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
