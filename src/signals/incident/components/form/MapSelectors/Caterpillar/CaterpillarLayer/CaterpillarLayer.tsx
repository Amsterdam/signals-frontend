// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type {
  Feature,
  Item,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'

import { featureToCoordinates } from 'shared/services/map-location'
import StatusLayer from '../../Asset/Selector/WfsLayer/StatusLayer'
import { getFeatureStatusType } from '../../Asset/Selector/WfsLayer/StatusLayer/utils'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const { selection, meta, setItem, removeItem } = useContext(SelectContext)

  const getMarker = useCallback(
    (feat: any, featureStatusTypes: FeatureStatusType[]) => {
      const feature = feat as Feature
      const coordinates = featureToCoordinates(feature.geometry as Geometrie)
      // Caterpillar layer renders only a single feature type (oak tree)
      const featureType = meta.featureTypes[0]

      const featureId = feature.properties[featureType.idField] as string
      const isSelected = selection?.id === featureId

      const featureStatusType = getFeatureStatusType(
        feature,
        featureStatusTypes
      )
      const description = featureStatusType
        ? featureStatusType.description
        : featureType.description

      const altText = isSelected
        ? `${description}, is geselecteerd (${featureId})`
        : `${description} (${featureId})`

      const icon = L.icon({
        iconSize: [40, 40],
        iconUrl: isSelected
          ? '/assets/images/featureSelectedMarker.svg'
          : featureType.icon.iconUrl,
      })

      const onClick = () => {
        if (isSelected) {
          removeItem()
          return
        }

        const { description, typeValue } = featureType
        const location = {
          coordinates,
        }

        const item: Item = {
          id: featureId,
          type: typeValue,
          description,
          status: featureStatusType?.typeValue,
          location,
          label: [description, featureId].filter(Boolean).join(' - '),
        }

        meta.extraProperties?.forEach((propertyKey) => {
          item[propertyKey] = feature.properties[propertyKey]
        })

        setItem(item, location)
      }

      return (
        <Marker
          key={`${featureId}-${isSelected}`}
          options={{
            icon,
            alt: altText,
          }}
          latLng={coordinates}
          events={{
            click: onClick,
          }}
        />
      )
    },
    [meta.extraProperties, meta.featureTypes, removeItem, selection, setItem]
  )

  const featureStatusTypes = meta.featureStatusTypes || []

  const statusFeatures = features.filter(
    (feature) =>
      getFeatureStatusType(feature as Feature, featureStatusTypes) !== undefined
  )

  return (
    <>
      {features.map((feat) => getMarker(feat, featureStatusTypes))}
      {statusFeatures.length > 0 && featureStatusTypes && (
        <StatusLayer
          statusFeatures={statusFeatures as Feature[]}
          featureStatusTypes={featureStatusTypes}
        />
      )}
    </>
  )
}

export default CaterpillarLayer
