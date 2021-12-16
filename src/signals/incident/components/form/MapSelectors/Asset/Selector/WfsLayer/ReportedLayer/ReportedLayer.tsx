// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import L from 'leaflet'
import './style.css'

import type { FC } from 'react'
import type {
  Feature,
  FeatureType,
} from 'signals/incident/components/form/MapSelectors/Asset/types'
import { Marker } from '@amsterdam/arm-core'
import { getIconUrl } from 'signals/incident/components/form/MapSelectors/utils'
import { reported as ReportedIcon } from 'signals/incident/definitions/wizard-step-2-vulaan/verlichting-icons'
import { featureTolocation } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'

const REPORTED_CLASS_MODIFIER = 'marker-reported'

export interface ReportedLayerProps {
  reportedFeatures: Feature[]
  reportedFeatureType?: FeatureType
  desktopView?: boolean
}

const ReportedLayer: FC<ReportedLayerProps> = ({
  reportedFeatures,
  reportedFeatureType,
}) => {
  if (!reportedFeatures || !reportedFeatureType) {
    return null
  }
  const getMarker = (feat: any) => {
    const feature = feat as Feature
    const latLng = featureTolocation(feature.geometry as Geometrie)

    if (!reportedFeatureType) return

    const icon = L.icon({
      iconSize: [20, 20],
      iconUrl: getIconUrl(ReportedIcon),
      className: REPORTED_CLASS_MODIFIER,
    })

    const featureId = feature.properties[reportedFeatureType.idField]

    return (
      <Marker
        key={featureId}
        latLng={latLng}
        options={{
          zIndexOffset: 1000,
          icon,
          alt: `Is gemeld - ${featureId}`,
        }}
      />
    )
  }
  return <>{reportedFeatures.map(getMarker)}</>
}

export default ReportedLayer
