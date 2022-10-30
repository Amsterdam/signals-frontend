// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam

import type { Feature } from 'geojson'

import type { Filter, Properties } from '../../types'

export const computeNrOfIncidentsPerFilter = (
  filters: Filter[],
  incidents: Feature<any, Properties>[]
): Filter[] => {
  return filters.map((filter: Filter) => {
    const nrOfIncidents = incidents.reduce((acc: number, incident) => {
      return filter.slug === incident.properties.category.slug ||
        filter.slug === incident.properties.category.parent.slug
        ? acc + 1
        : acc
    }, 0)

    return {
      ...filter,
      subCategories:
        filter.subCategories &&
        computeNrOfIncidentsPerFilter(filter.subCategories, incidents),
      nrOfIncidents,
    } as Filter
  })
}
