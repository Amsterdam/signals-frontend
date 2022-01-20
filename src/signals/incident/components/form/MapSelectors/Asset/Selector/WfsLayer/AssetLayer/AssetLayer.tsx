// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import type { FC } from 'react'
import L from 'leaflet'

import type {
  DataLayerProps,
  Item,
  Feature,
} from 'signals/incident/components/form/MapSelectors/types'
import type { FeatureCollection } from 'geojson'
import type { Geometrie } from 'types/incident'

import reverseGeocoderService from 'shared/services/reverse-geocoder'
import AssetSelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { featureToCoordinates } from 'shared/services/map-location'

import featureSelectedMarkerUrl from 'shared/images/featureSelectedMarker.svg?url'

import { Marker } from '@amsterdam/arm-core'
import defaultFeatureMarkerUrl from 'shared/images/featureDefaultMarker.svg?url'
import WfsDataContext from '../context'

export const AssetLayer: FC<DataLayerProps> = ({ featureTypes }) => {
  const data = useContext<FeatureCollection>(WfsDataContext)
  const { selection, removeItem, setItem } = useContext(AssetSelectContext)

  const getFeatureType = useCallback(
    (feature: Feature) => {
      return featureTypes.find(
        ({ typeField, typeValue }) =>
          feature.properties[typeField] === typeValue
      )
    },
    [featureTypes]
  )

  const getMarker = (feat: any) => {
    const feature = feat as Feature
    const coordinates = featureToCoordinates(feature?.geometry as Geometrie)

    const featureType = getFeatureType(feature)
    if (!featureType) return null

    const { description, typeValue, idField } = featureType
    const id = feature.properties[idField] || ''

    const isSelected = Boolean(selection?.id === id)

    const iconUrl = isSelected
      ? featureSelectedMarkerUrl
      : featureType.icon.iconUrl
    const icon = L.icon({ iconUrl: iconUrl || defaultFeatureMarkerUrl })

    const onClick = async () => {
      if (typeValue === 'reported') {
        return
      }

      if (isSelected) {
        removeItem()
        return
      }

      const isReported = feature.properties.meldingstatus === 1

      const item: Item = {
        id,
        type: typeValue,
        description,
        isReported: isReported,
        location: {
          coordinates,
        },
        label: [description, isReported && 'is gemeld', id]
          .filter(Boolean)
          .join(' - '),
      }

      const response = await reverseGeocoderService(coordinates)

      if (response) {
        item.location.address = response.data.address
      }

      setItem(item)
    }

    return (
      <Marker
        key={`${id}-${isSelected}`}
        options={{
          icon,
          alt: `${featureType.description}${
            isSelected ? ', is geselecteerd' : ''
          } (${id})`,
        }}
        latLng={coordinates}
        events={{
          click: onClick,
        }}
      />
    )
  }
  return <>{data.features.map(getMarker)}</>
}

export default AssetLayer
