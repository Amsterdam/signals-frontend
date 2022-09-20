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

  const result = incidents.filter((incident) =>
    activeFilterSlugs.includes(incident.properties.category.parent.slug)
  )

  return result
}
