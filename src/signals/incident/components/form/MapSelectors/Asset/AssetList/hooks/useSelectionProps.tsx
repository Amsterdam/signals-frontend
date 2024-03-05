// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 - 2024 Gemeente Amsterdam
import { useContext } from 'react'

import { useSelector } from 'react-redux'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import { makeSelectMaxAssetWarning } from 'signals/incident/containers/IncidentContainer/selectors'
import type { Location } from 'types/incident'

import type {
  FeatureStatusType,
  FeatureType,
  Item,
  SelectableFeature,
} from '../../../types'
import { FeatureStatus } from '../../../types'
import AssetSelectContext from '../../context'

type Props = {
  featureTypes: FeatureType[]
  featureStatusTypes: FeatureStatusType[]
  feature: SelectableFeature
  selection?: Item[]
}

export const useSelectionProps = ({
  featureTypes,
  featureStatusTypes,
  feature,
  selection,
}: Props) => {
  const { setItem } = useContext(AssetSelectContext)
  const { maxAssetWarning } = useSelector(makeSelectMaxAssetWarning)
  const featureStatusType = featureStatusTypes.find(
    ({ typeValue }) => typeValue === status
  )
  const item: Item = {
    ...feature,
    address: undefined,
    status: featureStatusType?.typeValue,
  }

  if (selection?.find((item) => item.id === feature.id)) return null

  const { icon }: Partial<FeatureType> =
    featureTypes?.find(({ typeValue }) => typeValue === feature.type) ?? {}

  const onClick = async () => {
    if (feature.type !== FeatureStatus.REPORTED && !maxAssetWarning) {
      const location: Location = { coordinates: feature.coordinates }

      const response = await reverseGeocoderService(feature.coordinates)

      if (response) {
        location.address = response.data.address
        item.address = response.data.address
      }
      ;(window as any)?.dataLayer?.push({
        event: 'interaction.generic.component.mapInteraction',
        meta: {
          category: 'interaction.generic.component.mapInteraction',
          action: 'checkboxClickOn',
          label: `${item.label}`,
        },
      })

      setItem(item, location)
    }
  }

  return { id: feature.id, item: feature, featureStatusType, icon, onClick }
}
