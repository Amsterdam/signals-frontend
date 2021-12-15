// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext, useRef, useMemo } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type { Item } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import { featureTolocation } from 'shared/services/map-location'
import { getIconUrl } from '../../utils'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const {
    selection: selectionContext,
    meta,
    setItem,
  } = useContext(SelectContext)
  const selection = useRef<Item | undefined>(selectionContext)

  selection.current = useMemo(() => selectionContext, [selectionContext])

  const getMarker = useCallback(
    (feat: any) => {
      const feature = feat as Feature
      const coordinates = featureTolocation(feature.geometry as Geometrie)
      // Caterpillar layer renders only a single feature type (oak tree)
      const featureType = meta.featureTypes[0]
      const featureId = feature.properties[featureType.idField] as string

      const isSelected = selectionContext?.id === featureId

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

      const iconSvg = meta.icons?.find(({ id }) => id === iconId)?.icon

      const icon = L.icon({
        iconSize: isReported ? [44, 44] : [40, 40],
        iconUrl: getIconUrl(iconSvg),
      })

      const onClick = () => {
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
      selectionContext,
      setItem,
    ]
  )

  return <>{features.map(getMarker)}</>
}

export default CaterpillarLayer
