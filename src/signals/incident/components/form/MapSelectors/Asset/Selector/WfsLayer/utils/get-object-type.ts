// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'geojson'

import { FeatureTypes } from '../../../../types'

export const getObjectType = (features: Feature[]) => {
  if (!features[0].id) return null

  const feature = features[0]

  if (typeof feature.id === 'string' && feature.id?.startsWith('container')) {
    return FeatureTypes.CONTAINER
  } else if (
    typeof feature.id === 'string' &&
    feature.id.startsWith('openbareverlichting')
  ) {
    return FeatureTypes.PUBLIC_LIGHTS
  } else if (
    typeof feature.id === 'number' &&
    feature.properties &&
    // properties is an object or an array with a species
    ('species' in feature.properties || 'species' in feature.properties[0])
  ) {
    return FeatureTypes.CATERPILLAR
  }

  return null
}
