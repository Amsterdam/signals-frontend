// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Feature } from 'geojson'

import type { Filter, Point, Properties } from '../../types'

export const getFilteredIncidents = (
  filters: Filter[],
  incidents: Feature<Point, Properties>[]
): Feature<Point, Properties>[] => {
  const activeFilterSlugs = filters
    .filter((filter) => filter.filterActive)
    .map((filter) => filter.slug)

  const activeIncidents = incidents.filter((incident) =>
    activeFilterSlugs.includes(incident.properties.category.parent.slug)
  )

  const listedIcons = getListOfIcons(filters)

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
