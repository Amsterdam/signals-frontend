// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import StatusLayer from '../../Asset/Selector/WfsLayer/StatusLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature } from '../../types'
import {
  getIsReported,
  getReportedFeatureType,
} from '../../Asset/Selector/WfsLayer/StatusLayer/utils'

export const ClockLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const reportedFeatureType = getReportedFeatureType(meta.featureTypes)
  const reportedFeatures = reportedFeatureType
    ? data.features.filter((feature) =>
        getIsReported(feature as unknown as Feature, reportedFeatureType)
      )
    : []

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} desktopView={desktopView} />
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <StatusLayer
          statusFeatures={reportedFeatures as Feature[]}
          reportedFeatureType={reportedFeatureType}
        />
      )}
    </>
  )
}

export default ClockLayer
