import type { LatLngLiteral } from 'leaflet'

import type {
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
import {
  isTemplateString,
  parseTemplateString,
} from 'utils/parseTemplateString'

import type { FeatureType, SelectableFeature } from '../../../../types'

export const mapToSelectableFeature = (
  feature: Feature,
  featureType: FeatureType,
  coordinates: LatLngLiteral,
  featureStatusType?: FeatureStatusType
) => {
  const { description, typeValue, idField } = featureType
  const id = feature.properties[idField] || ''

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
}
