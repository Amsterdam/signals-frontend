// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { Filter, Incident } from '../../types'

export const countIncidentsPerFilter = (
  filters: Filter[],
  incidents: Incident[]
): Filter[] => {
  const counts = new Map<string, number>()

  incidents.forEach((incident) => {
    counts.set(
      incident.properties.category.slug,
      (counts.get(incident.properties.category.slug) || 0) + 1
    )
    if (
      incident.properties.category.slug !==
      incident.properties.category.parent.slug
    ) {
      counts.set(
        incident.properties.category.parent.slug,
        (counts.get(incident.properties.category.parent.slug) || 0) + 1
      )
    }
  })

  return filters.map((filter: Filter) => ({
    ...filter,
    subCategories:
      filter.subCategories &&
      filter.subCategories.map((filter: Filter) => ({
        ...filter,
        incidentsCount: counts.get(filter.slug) || 0,
      })),
    incidentsCount: counts.get(filter.slug) || 0,
  }))
}
