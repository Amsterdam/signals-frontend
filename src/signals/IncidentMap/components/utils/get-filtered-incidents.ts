// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 -2023 Gemeente Amsterdam
import type { Filter, Incident } from '../../types'
import { showSubCategoryFilter } from '../FilterPanel/utils'

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

  const mainCategoriesWithSub = filters
    .filter((filter) => filter.show_children_in_filter)
    .map((filter) => filter.slug)

  const activeIncidents = incidents.filter((incident) => {
    const activeSlugs = activeFilters.map((filter) => filter.slug)
    return (
      activeSlugs.includes(incident.properties.category.slug) ||
      (!showSubCategoryFilter(
        mainCategoriesWithSub,
        incident.properties.category.parent.slug
      ) &&
        activeSlugs.includes(incident.properties.category.parent.slug))
    )
  })

  return activeIncidents
}
