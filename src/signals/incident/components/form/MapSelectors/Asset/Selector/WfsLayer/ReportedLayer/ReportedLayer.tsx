// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useCallback, useContext } from 'react'
import L from 'leaflet'
import './style.css'

import type { FeatureCollection } from 'geojson'
import type { FC } from 'react'
import type {
  DataLayerProps,
  Feature,
} from 'signals/incident/components/form/MapSelectors/Asset/types'
import { Marker } from '@amsterdam/arm-core'
import { getIconUrl } from 'signals/incident/components/form/MapSelectors/utils'
import { reported as ReportedIcon } from 'signals/incident/definitions/wizard-step-2-vulaan/verlichting-icons'
import { featureTolocation } from 'shared/services/map-location'
import type { Geometrie } from 'types/incident'
import WfsDataContext from '../context'

const REPORTED_CLASS_MODIFIER = 'marker-reported'

const ReportedLayer: FC<DataLayerProps> = ({ featureTypes }) => {
  const data = useContext<FeatureCollection>(WfsDataContext)

  const getFeatureType = useCallback(
    (feat: any) => {
      const feature = feat as Feature
      if (feature.properties.meldingstatus === 1) {
        return featureTypes.find(
          ({ typeValue, typeField }) =>
            typeValue !== 'reported' &&
            typeValue === feature.properties[typeField]
        )
      }
    },
    [featureTypes]
  )

  const getMarker = (feat: any) => {
    const feature = feat as Feature
    const latLng = featureTolocation(feature.geometry as Geometrie)
    const featureType = getFeatureType(feature)

    if (!featureType) return

    const icon = L.icon({
      iconSize: [20, 20],
      iconUrl: getIconUrl(ReportedIcon),
      className: REPORTED_CLASS_MODIFIER,
    })

    const featureId = feature.properties[featureType.idField]

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

  return (
    <>
      {data.features
        .filter((feature) => feature?.properties?.meldingstatus === 1)
        .map(getMarker)}
    </>
  )
}

export default ReportedLayer
