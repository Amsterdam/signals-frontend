// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useContext } from 'react'

import { featureToCoordinates } from '../../../../../../../../shared/services/map-location'
import reverseGeocoderService from '../../../../../../../../shared/services/reverse-geocoder'
import type {
  Geometrie,
  Location,
} from '../../../../../../../../types/incident'
import {
  isTemplateString,
  parseTemplateString,
} from '../../../../../../../../utils/parseTemplateString'
import type { Feature, FeatureType, Item } from '../../../types'
import { FeatureStatus } from '../../../types'
import AssetSelectContext from '../../context'
import type { Props } from '../AssetListItemSelectable'

const getFeatureType = (feature: Feature, featureTypes: FeatureType[]) => {
  return featureTypes.find(
    ({ typeField, typeValue }) => feature.properties[typeField] === typeValue
  )
}
export const useSelectionProps = ({
  featureTypes,
  featureStatusTypes,
  feature,
  selection,
}: Props) => {
  const { setItem } = useContext(AssetSelectContext)

  const coordinates = featureToCoordinates(feature.geometry as Geometrie)

  const featureType = getFeatureType(feature, featureTypes)
  if (!featureType) return null

  const { description, typeValue, idField } = featureType
  const id = feature.properties[idField] || ''

  const featureStatusType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === status
  )

  const label = isTemplateString(description)
    ? parseTemplateString(description, feature.properties)
    : [description, id].filter(Boolean).join(' - ')

  const item: Item = {
    id: `${coordinates.lat}.${coordinates.lng}.${feature.properties.created_at}`,
    label: label,
    description: featureType.description,
    type: featureType.typeValue,
    coordinates,
  }

  if (selection?.find((item) => item.id === id)) return null

  const { icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === item.type) ?? {}

  const onClick = async () => {
    if (typeValue !== FeatureStatus.REPORTED) {
      const location: Location = { coordinates }

      const item: Item = {
        id,
        type: typeValue,
        description,
        status: featureStatusType?.typeValue,
        label,
        coordinates,
      }

      setItem(item, location)

      const response = await reverseGeocoderService(coordinates)

      if (response) {
        location.address = response.data.address
        item.address = response.data.address
      }

      setItem(item, location)
    }
  }

  return { id, item, featureStatusType, icon, onClick }
}
