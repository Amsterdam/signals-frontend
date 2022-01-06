// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature, FeatureType } from '../../Asset/types'

const REPORTED = 1

export const StreetlightLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const reportedFeatureType = meta.featureTypes.find(
    ({ typeValue }) => typeValue === 'reported'
  )

  const reportedFeatures = data.features.filter(
    (feature) => feature.properties?.meldingstatus === REPORTED
  )

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} />
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <ReportedLayer
          reportedFeatures={reportedFeatures as Feature[]}
          reportedFeatureType={reportedFeatureType as FeatureType}
        />
      )}
    </>
  )
}

export default StreetlightLayer
