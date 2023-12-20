// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'geojson'

import { featureToCoordinates } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import {
  isTemplateString,
  parseTemplateString,
} from 'utils/parseTemplateString'

import { getFeatureType } from './get-feature-type'
import { getObjectType } from './get-object-type'
import { FeatureTypes } from '../../../../../../form/MapSelectors/types'
import type {
  FeatureType,
  SelectableFeature,
} from '../../../../../../form/MapSelectors/types'

export const mapDataToSelectableFeature = (
  features: Feature[],
  featureTypes: FeatureType[]
): SelectableFeature[] => {
  if (!features || features.length === 0) return []

  const objectType = getObjectType(features)

  switch (objectType) {
    case FeatureTypes.CONTAINER:
    case FeatureTypes.PUBLIC_LIGHTS:
      return features.map((feature) => {
        const { idField, description, typeValue } = getFeatureType(
          feature,
          featureTypes
        )

        const id_number =
          (feature.properties && feature.properties[idField]) || ''
        const label = isTemplateString(description)
          ? parseTemplateString(description, feature.properties)
          : [description, id_number].filter(Boolean).join(' - ')

        const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

        return {
          coordinates,
          description: description,
          id: id_number,
          label: label,
          type: typeValue,
        }
      })
    case FeatureTypes.CATERPILLAR:
      return features.map((feature) => {
        const { description, typeValue } = featureTypes[0]

        const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

        return {
          id: feature.id || '',
          type: typeValue,
          description,
          coordinates,
          label: [description, feature.id].filter(Boolean).join(' - '),
        }
      })

    default:
      return []
  }
}
