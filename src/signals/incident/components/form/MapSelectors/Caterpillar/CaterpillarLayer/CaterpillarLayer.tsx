// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type { Item } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import defaultFeatureMarkerUrl from 'shared/images/featureDefaultMarker.svg?url'
import { featureToCoordinates } from 'shared/services/map-location'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const { selection, meta, setItem, removeItem } = useContext(SelectContext)

  const getMarker = useCallback(
    (feat: any) => {
      const feature = feat as Feature
      const coordinates = featureToCoordinates(feature.geometry as Geometrie)
      // Caterpillar layer renders only a single feature type (oak tree)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const featureType = meta.featureTypes.find(
        ({ label }) => label === 'Eikenboom'
      )!
      const featureId = feature.properties[featureType.idField] as string

      const isSelected = selection?.id === featureId

      const isReported = Boolean(
        featureType.isReportedField &&
          feature.properties[featureType.isReportedField] ===
            featureType.isReportedValue
      )

      let iconId = isReported
        ? featureType.iconIsReportedId
        : featureType.iconId

      if (isSelected) {
        iconId = isReported ? 'isSelectedAndReported' : 'isSelected'
      }

      const iconUrl = meta.icons?.find(({ id }) => id === iconId)?.iconUrl

      const icon = L.icon({
        iconSize: isReported ? [44, 44] : [40, 40],
        iconUrl: iconUrl || defaultFeatureMarkerUrl,
      })

      const onClick = () => {
        if (isSelected) {
          removeItem()
          return
        }

        const { description, typeValue } = featureType

        const item: Item = {
          id: featureId,
          type: typeValue,
          description,
          isReported,
          location: {
            coordinates,
          },
        }

        meta.extraProperties?.forEach((propertyKey) => {
          item[propertyKey] = feature.properties[propertyKey]
        })

        setItem(item)
      }

      return (
        <Marker
          key={`${featureId}-${isSelected}`}
          options={{
            icon,
            alt: `${featureType.description}${isReported ? ', is gemeld' : ''}${
              isSelected ? ', is geselecteerd' : ''
            } (${featureId})`,
          }}
          latLng={coordinates}
          events={{
            click: onClick,
          }}
        />
      )
    },
    [
      meta.extraProperties,
      meta.featureTypes,
      meta.icons,
      removeItem,
      selection,
      setItem,
    ]
  )

  return <>{features.map(getMarker)}</>
}

export default CaterpillarLayer
