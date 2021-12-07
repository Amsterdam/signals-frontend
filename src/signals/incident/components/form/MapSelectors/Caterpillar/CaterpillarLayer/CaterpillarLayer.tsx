// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext, useMemo, useRef } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import type { Item } from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Feature } from 'signals/incident/components/form/MapSelectors/types'
import { getIconUrl } from '../../utils'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const {
    selection: selectionContext,
    meta,
    update,
  } = useContext(SelectContext)
  const selection = useRef<Item[]>(selectionContext)

  selection.current = useMemo(() => selectionContext, [selectionContext])

  const getMarker = useCallback(
    (feat: any) => {
      const feature = feat as Feature

      const [lng, lat] = feature.geometry.coordinates
      // Caterpillar layer renders only a single feature type (oak tree)
      const featureType = meta.featureTypes[0]

      const isSelected =
        Array.isArray(selectionContext) &&
        selectionContext.some(
          ({ id }) => id === feature.properties[featureType.idField]
        )

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

      const iconSize = (isReported ? [44, 44] : [40, 40]) as [number, number]

      const icon = L.icon({
        iconSize,
        iconUrl: getIconUrl(iconSvg),
      })

      const onClick = () => {
        const { description, typeValue, idField } = featureType

        const item: Item = {
          id: feature.properties[idField] as string,
          type: typeValue,
          description,
          isReported,
        }

        meta.extraProperties?.forEach((propertyKey) => {
          item[propertyKey] = feature.properties[propertyKey]
        })

        const updateSelection = isSelected
          ? selection.current.filter(({ id }) => id !== item.id)
          : [...selection.current, item]

        update(updateSelection)
      }

      return (
        <Marker
          key={`${feature.properties[featureType.idField]}-${isSelected}`}
          options={{
            icon,
            alt: `${featureType.description}${isReported ? ', is gemeld' : ''}${
              isSelected ? ', is geselecteerd' : ''
            } (${feature.properties[featureType.idField]})`,
          }}
          latLng={{ lat, lng }}
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
      update,
    ]
  )

  return <>{features.map(getMarker)}</>
}

export default CaterpillarLayer
