import { featureToCoordinates } from 'shared/services/map-location'
import type {
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'
import {
  isTemplateString,
  parseTemplateString,
} from 'utils/parseTemplateString'

import type { FeatureType, SelectableFeature } from '../../../../types'
import { getFeatureStatusType } from '../../StatusLayer/utils'

export const mapDataToSelectableFeature = (
  features: Feature[],
  featureTypes: FeatureType[],
  featureStatusTypes: FeatureStatusType[] = []
): SelectableFeature[] => {
  const getFeatureType = (feature: Feature) => {
    return featureTypes.find(
      ({ typeField, typeValue }) => feature.properties[typeField] === typeValue
    )
  }

  const selectableFeatures = features
    .map((feature) => {
      const coordinates = featureToCoordinates(feature?.geometry as Geometrie)
      const featureType = getFeatureType(feature)

      if (!featureType) return null

      const { description, typeValue, idField } = featureType
      const id = feature.properties[idField] || ''

      const featureStatusType = getFeatureStatusType(
        feature,
        featureStatusTypes
      )

      const label = isTemplateString(description)
        ? parseTemplateString(description, feature.properties)
        : [description, id].filter(Boolean).join(' - ')

      const selectableFeature: SelectableFeature = {
        id: id.toString(),
        type: typeValue,
        description,
        status: featureStatusType?.typeValue,
        label,
        coordinates,
      }

      return selectableFeature
    })
    // filter out null values
    .flatMap((f) => (f ? [f] : []))

  return selectableFeatures
}
