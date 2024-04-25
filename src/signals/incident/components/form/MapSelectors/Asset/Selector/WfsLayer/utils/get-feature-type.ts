// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'

import type { FeatureType } from '../../../../types'

export const getFeatureType = (feature: Feature, featureTypes: FeatureType[]) =>
  featureTypes.find(({ typeField, typeValue }) => {
    return feature.properties?.[typeField] === typeValue
  })
