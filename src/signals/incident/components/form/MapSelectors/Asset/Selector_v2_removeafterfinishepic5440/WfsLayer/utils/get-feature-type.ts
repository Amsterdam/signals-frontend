// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'geojson'

import type { FeatureType } from '../../../../../../form/MapSelectors/types'

export const getFeatureType = (
  feature: Feature,
  featureTypes: FeatureType[]
): FeatureType =>
  featureTypes.find(
    ({ typeField, typeValue }) => feature.properties?.[typeField] === typeValue
  ) as FeatureType
