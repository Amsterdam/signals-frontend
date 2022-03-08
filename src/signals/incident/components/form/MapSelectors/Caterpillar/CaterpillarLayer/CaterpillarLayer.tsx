// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type {
  FeatureType,
  Feature,
  Item,
  ReportedFeatureType,
  CheckedFeatureType,
} from 'signals/incident/components/form/MapSelectors/types'
import type { Geometrie } from 'types/incident'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'

import { featureToCoordinates } from 'shared/services/map-location'
import StatusLayer from '../../Asset/Selector/VectorLayer/StatusLayer'
import {
  getCheckedFeatureType,
  getIsChecked,
  getIsReported,
  getReportedFeatureType,
} from '../../Asset/Selector/VectorLayer/StatusLayer/utils'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const { selection, meta, setItem, removeItem } = useContext(SelectContext)

  const getMarker = useCallback(
    (feat: any, reportedFeatureType, checkedFeatureType) => {
      const feature = feat as Feature
      const coordinates = featureToCoordinates(feature.geometry as Geometrie)
      // Caterpillar layer renders only a single feature type (oak tree)
      const featureType = meta.featureTypes.find(
        ({ typeValue }) => typeValue === 'Eikenboom'
      ) as FeatureType

      const featureId = feature.properties[featureType.idField] as string
      const isSelected = selection?.id === featureId

      const isReported = getIsReported(feature, reportedFeatureType)
      const isChecked = getIsChecked(feature, checkedFeatureType)

      let { description } = featureType
      if (isChecked && checkedFeatureType) {
        description = checkedFeatureType.description
      } else if (isReported) {
        description = reportedFeatureType.description
      }

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
          isReported,
          isChecked,
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

  const reportedFeatureType = getReportedFeatureType(meta.featureTypes)
  const checkedFeatureType = getCheckedFeatureType(meta.featureTypes)

  const statusFeatures = features.filter(
    (feature) =>
      getIsReported(
        feature as unknown as Feature,
        reportedFeatureType as ReportedFeatureType
      ) ||
      getIsChecked(
        feature as unknown as Feature,
        checkedFeatureType as CheckedFeatureType
      )
  )

  return (
    <>
      {features.map((feat) =>
        getMarker(feat, reportedFeatureType, checkedFeatureType)
      )}
      {statusFeatures.length > 0 &&
        reportedFeatureType &&
        checkedFeatureType && (
          <StatusLayer
            statusFeatures={statusFeatures as Feature[]}
            reportedFeatureType={reportedFeatureType as ReportedFeatureType}
            checkedFeatureType={checkedFeatureType as CheckedFeatureType}
          />
        )}
    </>
  )
}

export default CaterpillarLayer
