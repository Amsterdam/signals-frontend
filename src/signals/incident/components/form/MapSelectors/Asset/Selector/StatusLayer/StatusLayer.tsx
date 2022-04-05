// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import L from 'leaflet'
import './style.css'

import type { FC } from 'react'
import type {
  Feature,
  FeatureStatusType,
} from 'signals/incident/components/form/MapSelectors/types'
import { Marker } from '@amsterdam/arm-core'
import { featureToCoordinates } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import { getFeatureStatusType } from './utils'

const STATUS_CLASS_MODIFIER = 'marker-status'

export interface StatusLayerProps {
  statusFeatures: Feature[]
  featureStatusTypes: FeatureStatusType[]
}

const StatusLayer: FC<StatusLayerProps> = ({
  statusFeatures,
  featureStatusTypes,
}) => {
  const getMarker = (feat: any, index: number) => {
    const feature = feat as Feature
    const latLng = featureToCoordinates(feature?.geometry as Geometrie)

    const featureStatusType = getFeatureStatusType(feature, featureStatusTypes)
    if (featureStatusType) {
      const icon = L.icon({
        iconSize: [20, 20],
        iconUrl: featureStatusType.icon.iconUrl,
        className: STATUS_CLASS_MODIFIER,
      })

      const featureId = feature.properties[featureStatusType.idField] || index
      const altText = `${featureStatusType.description} - ${featureId}`

      return (
        <Marker
          key={featureId}
          latLng={latLng}
          options={{
            zIndexOffset: 1000,
            icon,
            alt: altText,
          }}
        />
      )
    } else {
      return null
    }
  }
  return <>{statusFeatures.map(getMarker)}</>
}

export default StatusLayer
