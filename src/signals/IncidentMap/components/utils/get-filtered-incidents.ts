// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Feature } from 'geojson'

import type { Filter, Point, Properties } from '../../types'
/*
When mainCategory is checked, all incidents on the map needs to be shown except for those incidents where the subCategory
of the maintCategory is unchecked.
 */
export const getFilteredIncidents = (
  filters: Filter[],
  incidents: Feature<Point, Properties>[]
): Feature<Point, Properties>[] => {
  const activeFilters = filters.reduce((acc: Filter[], filter) => {
    if (filter.filterActive) {
      acc.push(filter)
      if (filter.subCategories) {
        filter.subCategories.forEach((subfilter) => {
          subfilter.filterActive && acc.push(subfilter)
        })
      }
    }
    return acc
  }, [])

  const activeSlugs = activeFilters.map(filter => filter.slug)

  const activeIncidents = incidents.filter((incident) => {
    return (
      activeSlugs.includes(incident.properties.category.parent.slug) &&
      activeSlugs.includes(incident.properties.category.slug)
    )
  })

  const listedIcons = getListOfIcons(activeFilters)


  /** todo here we devide sub and main slugs and attach icons to it. Make less complex by
   * just loop over all the slug and find the icon
   */
  const incidentsWithIcon = activeIncidents.map((incident) => {
    const subCategorySlug = incident.properties.category.slug
    const mainCategorySlug = incident.properties.category.parent.slug

    const subIcon = listedIcons.subCategories.find(
      (iconObj) => iconObj.slug === subCategorySlug
    )

    if (subIcon) {
      return {
        ...incident,
        properties: {
          ...incident.properties,
          icon: subIcon.icon,
        },
      }
    }

    const mainIcon = listedIcons.mainCategories.find(
      (iconObj) => iconObj.slug === mainCategorySlug
    )

    if (mainIcon) {
      return {
        ...incident,
        properties: {
          ...incident.properties,
          icon: mainIcon.icon,
        },
      }
    }

    return incident
  })

  return incidentsWithIcon
}

interface Icon {
  slug: string
  icon: string
}

/**
 * todo we just need to get all icons and slugs from activeFilters here, less complexity pleazee
 *
 *
 */
const getListOfIcons = (filters: Filter[]) => {
  const mainCategories: Icon[] = []
  const subCategories: Icon[] = []


  filters.forEach((filter) => {
    if (filter.icon) {
      mainCategories.push({
        slug: filter.slug,
        icon: filter.icon,
      })
    }

    if (filter.subCategories) {
      filter.subCategories.map((subCategory) => {
        if (subCategory.icon) {
          subCategories.push({
            slug: subCategory.slug,
            icon: subCategory.icon,
          })
        }
      })
    }
  })

  return {
    mainCategories,
    subCategories,
  }
}
