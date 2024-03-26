// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
// import type { Feature } from 'geojson'

import { featureToCoordinates } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import {
  isTemplateString,
  parseTemplateString,
} from 'utils/parseTemplateString'
import L from 'leaflet'
import type {
  Item,
  Feature,
  // FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
// import { getFeatureType } from './get-feature-type'
import { getObjectType } from './get-object-type'
import { FeatureStatus, FeatureTypes } from '../../../../types'
import type { FeatureType, SelectableFeature } from '../../../../types'
import { getFeatureStatusType } from '../../StatusLayer/utils'

export const mapDataToSelectableFeature = (
  features: Feature[],
  featureTypes: FeatureType[]
): SelectableFeature[] => {
  const getFeatureType = (feature: Feature) => {
    return featureTypes.find(
      ({ typeField, typeValue }) => feature.properties[typeField] === typeValue
    )
  }

  const featuresModified = features.map((feature) => {
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

    const featureType = getFeatureType(feature)
    if (!featureType) return null

    const { description, typeValue, idField } = featureType
    const id = feature.properties[idField] || ''
    // const isSelected = Boolean(selection?.find((item) => item.id === id))

    // const iconUrl = isSelected
    //   ? '/assets/images/feature-selected-marker.svg'
    //   : featureType.icon.iconUrl
    const icon = L.icon({
      iconSize: featureType.icon?.options?.iconSize || [40, 40],
      iconUrl: '/assets/images/feature-default-marker.svg',
    })

    const featureStatusType = getFeatureStatusType(feature, featureTypes)

    const label = isTemplateString(description)
      ? parseTemplateString(description, feature.properties)
      : [description, id].filter(Boolean).join(' - ')

    // const alt = isTemplateString(description)
    //   ? parseTemplateString(description, feature.properties)
    //   : `${featureType.description}${
    //       isSelected ? ', is geselecteerd' : ''
    //     } (${id})`

    if (typeValue !== FeatureStatus.REPORTED) {
      // const location: Location = { coordinates }

      const item: Item = {
        id: id.toString(),
        type: typeValue,
        description,
        status: featureStatusType?.typeValue,
        label,
        coordinates,
      }

      // if (isSelected) {
      //   removeItem(item)
      //   return
      // }

      // setItem(item, location)

      // const response = await reverseGeocoderService(coordinates)

      // if (response) {
      //   location.address = response.data.address
      //   item.address = response.data.address
      // }

      // setItem(item, location)

      return item
    }
  })
  console.log('---  featuresModified:', featuresModified)

  return featuresModified as unknown as SelectableFeature[]

  // if (!features || features.length === 0) return []

  // const objectType = getObjectType(features)

  // switch (objectType) {
  //   case FeatureTypes.CONTAINER:
  //   case FeatureTypes.PUBLIC_LIGHTS:
  //     return features.map((feature) => {
  //       const { idField, description, typeValue } = getFeatureType(
  //         feature,
  //         featureTypes
  //       )

  //       const id_number =
  //         (feature.properties && feature.properties[idField]) || ''
  //       const label = isTemplateString(description)
  //         ? parseTemplateString(description, feature.properties)
  //         : [description, id_number].filter(Boolean).join(' - ')

  //       const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

  //       return {
  //         coordinates,
  //         description: description,
  //         id: id_number,
  //         label: label,
  //         type: typeValue,
  //       }
  //     })
  //   case FeatureTypes.CATERPILLAR:
  //     return features.map((feature) => {
  //       const { description, typeValue } = featureTypes[0]

  //       const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

  //       return {
  //         id: feature.id || '',
  //         type: typeValue,
  //         description,
  //         coordinates,
  //         label: [description, feature.id].filter(Boolean).join(' - '),
  //       }
  //     })

  //   default:
  //     return []
  // }
}
