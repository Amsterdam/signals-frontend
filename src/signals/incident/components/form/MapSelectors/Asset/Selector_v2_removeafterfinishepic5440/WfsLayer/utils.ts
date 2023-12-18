// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { Feature } from 'geojson'

import { featureToCoordinates } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import {
  isTemplateString,
  parseTemplateString,
} from 'utils/parseTemplateString'

import { FeatureTypes } from '../../../../../form/MapSelectors/types'
import type {
  FeatureType,
  SelectableFeature,
} from '../../../../../form/MapSelectors/types'

const getFeatureType = (
  feature: Feature,
  featureTypes: FeatureType[]
): FeatureType => {
  return featureTypes.find(
    ({ typeField, typeValue }) => feature.properties?.[typeField] === typeValue
  ) as FeatureType
}

const getObjectType = (features: Feature[]) => {
  if (!features[0].id) return null

  const feature = features[0]

  if (typeof feature.id === 'string' && feature.id?.startsWith('container')) {
    return FeatureTypes.CONTAINER
  } else if (
    feature.id === typeof String &&
    feature.id.startsWith('openbareverlichting')
  ) {
    return FeatureTypes.PUBLIC_LIGHTS
  } else if (
    feature.id === typeof Number &&
    feature.properties?.include('species')
  ) {
    return FeatureTypes.CATERPILLAR
  }

  return null
}

export const mapDataToSelectableFeature = (
  features: Feature[],
  featureTypes: FeatureType[]
): SelectableFeature[] => {
  if (!features || features.length === 0) return []

  const objectType = getObjectType(features)

  switch (objectType) {
    case FeatureTypes.CONTAINER:
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
    default:
      return []
  }
}
