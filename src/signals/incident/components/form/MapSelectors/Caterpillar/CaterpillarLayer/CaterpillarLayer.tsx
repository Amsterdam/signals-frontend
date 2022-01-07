// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import L from 'leaflet'
import { Marker } from '@amsterdam/arm-core'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type {
  Item,
  FeatureType,
  Feature,
} from 'signals/incident/components/form/MapSelectors/Asset/types'
import type { Geometrie } from 'types/incident'

import WfsDataContext from 'signals/incident/components/form/MapSelectors/Asset/Selector/WfsLayer/context'
import SelectContext from 'signals/incident/components/form/MapSelectors/Asset/context'
import featureSelectedMarkerUrl from 'shared/images/featureSelectedMarker.svg?url'

import { featureToCoordinates } from 'shared/services/map-location'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'

export const CaterpillarLayer: FC = () => {
  const { features } = useContext<FeatureCollection>(WfsDataContext)
  const { selection, meta, setItem, removeItem } = useContext(SelectContext)

  const getMarker = useCallback(
    (feat: any) => {
      const feature = feat as Feature
      const coordinates = featureToCoordinates(feature.geometry as Geometrie)
      // Caterpillar layer renders only a single feature type (oak tree)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const featureType = meta.featureTypes!.find(
        ({ typeValue }) => typeValue === 'Eikenboom'
      )!
      const featureId = feature.properties[featureType.idField] as string

      const isSelected = selection?.id === featureId

      const isReported = Boolean(
        featureType.isReportedField &&
          feature.properties[featureType.isReportedField] ===
            featureType.isReportedValue
      )

      const altText = `${featureType.description}${
        isReported ? ', is gemeld' : ''
      }${isSelected ? ', is geselecteerd' : ''} (${featureId})`

      const icon = L.icon({
        iconSize: [40, 40],
        iconUrl: isSelected
          ? featureSelectedMarkerUrl
          : featureType.icon.iconUrl,
      })

      const onClick = async () => {
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const reportedFeatureType = meta.featureTypes.find(
    ({ typeValue }) => typeValue === 'reported'
  )!
  const reportedFeatures = features.filter((feature) =>
    Boolean(
      reportedFeatureType?.isReportedField &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        feature.properties![reportedFeatureType.isReportedField] ===
          reportedFeatureType.isReportedValue
    )
  )

  return (
    <>
      {features.map(getMarker)}
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <ReportedLayer
          reportedFeatures={reportedFeatures as Feature[]}
          reportedFeatureType={reportedFeatureType as FeatureType}
        />
      )}
    </>
  )
}

export default CaterpillarLayer
