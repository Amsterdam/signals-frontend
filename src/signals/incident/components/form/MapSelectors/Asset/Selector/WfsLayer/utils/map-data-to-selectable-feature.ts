import { featureToCoordinates } from 'shared/services/map-location'
import type {
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'

import { getFeatureType } from './get-feature-type'
import { mapToSelectableFeature } from './map-to-selectable-feature'
import type { FeatureType, SelectableFeature } from '../../../../types'
import { getFeatureStatusType } from '../../StatusLayer/utils'

export const mapDataToSelectableFeature = (
  features: Feature[],
  featureTypes: FeatureType[],
  featureStatusTypes: FeatureStatusType[] = []
): SelectableFeature[] => {
  const selectableFeatures = features
    .map((feature) => {
      const coordinates = featureToCoordinates(feature?.geometry as Geometrie)
      const featureType = getFeatureType(feature, featureTypes)
      const featureStatusType = getFeatureStatusType(
        feature,
        featureStatusTypes
      )

      if (!featureType) return null

      return mapToSelectableFeature(
        feature,
        featureType,
        coordinates,
        featureStatusType
      )
    })
    // filter out null values
    .flatMap((f) => (f ? [f] : []))

  return selectableFeatures
}
