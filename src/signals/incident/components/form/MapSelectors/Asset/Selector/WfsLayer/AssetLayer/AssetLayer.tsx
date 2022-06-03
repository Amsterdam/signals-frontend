// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import type { FC } from 'react'
import L from 'leaflet'
import 'types/address'

import type { FeatureCollection } from 'geojson'
import type { Geometrie, Location } from 'types/incident'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { featureToCoordinates } from 'shared/services/map-location'

import type {
  Item,
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'

import { Marker } from '@amsterdam/arm-core'
import { FeatureStatus } from 'signals/incident/components/form/MapSelectors/types'
import WfsDataContext from '../context'
import { getFeatureStatusType } from '../../StatusLayer/utils'

export const AssetLayer: FC = () => {
  const data = useContext<FeatureCollection>(WfsDataContext)
  const { selection, removeItem, setItem, meta } =
    useContext(AssetSelectContext)
  const { featureTypes } = meta
  const featureStatusTypes = meta.featureStatusTypes || []

  const getFeatureType = useCallback(
    (feature: Feature) => {
      return featureTypes.find(
        ({ typeField, typeValue }) =>
          feature.properties[typeField] === typeValue
      )
    },
    [featureTypes]
  )

  const getMarker = (feat: any, featureStatusTypes: FeatureStatusType[]) => {
    const feature = feat as Feature
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

    const featureType = getFeatureType(feature)
    if (!featureType) return null

    const { description, typeValue, idField } = featureType
    const id = feature.properties[idField] || ''
    const isSelected = Boolean(
      selection && selection.find((item) => item.id === id)
    )

    const iconUrl = isSelected
      ? '/assets/images/featureSelectedMarker.svg'
      : featureType.icon.iconUrl
    const icon = L.icon({
      iconSize: featureType.icon?.options?.iconSize || [40, 40],
      iconUrl: iconUrl || '/assets/images/featureDefaultMarker.svg',
    })

    const featureStatusType = getFeatureStatusType(feature, featureStatusTypes)

    const onClick = async () => {
      if (typeValue === FeatureStatus.REPORTED) {
        return
      }

      const location: Location = {
        coordinates,
      }

      const item: Item = {
        id,
        type: typeValue,
        description,
        status: featureStatusType?.typeValue,
        label: [description, id].filter(Boolean).join(' - '),
        coordinates,
      }

      if (isSelected) {
        removeItem(item)
        return
      }

      const response = await reverseGeocoderService(coordinates)

      if (response) {
        location.address = response.data.address
        item.address = response.data.address
      }

      setItem(item, location)
    }

    return (
      <Marker
        key={`${id}-${isSelected}`}
        options={{
          icon,
          alt: `${featureType.description}${
            isSelected ? ', is geselecteerd' : ''
          } (${id})`,
          keyboard: false,
        }}
        latLng={coordinates}
        events={{
          click: onClick,
        }}
      />
    )
  }
  return (
    <>
      {data.features.map((feat) => getMarker(feat, featureStatusTypes || []))}
    </>
  )
}

export default AssetLayer
