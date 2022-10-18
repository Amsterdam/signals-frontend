// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Filter, Incident, Icon } from '../../types'

export const getFilteredIncidents = (
  filters: Filter[],
  incidents: Incident[]
): Incident[] => {
  const activeFilterSlugs = filters
    .filter((filter) => filter.filterActive)
    .map((filter) => filter.slug)

  const activeIncidents = incidents.filter((incident) =>
    activeFilterSlugs.includes(incident.properties.category.parent.slug)
  )
  const listedIcons = getListOfIcons(filters)

  return getIncidentsWithIcon(activeIncidents, listedIcons)
}

function getIncidentsWithIcon(
  activeIncidents: Incident[],
  listedIcons: { mainCategories: Icon[]; subCategories: Icon[] }
) {
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

const getListOfIcons = (filters: Filter[]) => {
  return filters.reduce(
    (acc: { mainCategories: Icon[]; subCategories: Icon[] }, filter) => {
      if (filter.icon) {
        acc.mainCategories.push({
          slug: filter.slug,
          icon: filter.icon,
        })
      }

      if (filter.subCategories) {
        filter.subCategories.map((subCategory) => {
          if (subCategory.icon) {
            acc.subCategories.push({
              slug: subCategory.slug,
              icon: subCategory.icon,
            })
          }
        })
      }
      return acc
    },
    { mainCategories: [], subCategories: [] }
  )
}
