// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { Feature } from 'geojson'

import type { Filter, Properties } from '../../types'

export const computeincidentsCountPerFilter = (
  filters: Filter[],
  incidents: Feature<any, Properties>[]
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
        incidentsCounts: counts.get(filter.slug) || 0,
      })),
    incidentsCounts: counts.get(filter.slug) || 0,
  }))
}
