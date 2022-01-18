// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature, ReportedFeatureType } from '../../types'

export const StreetlightLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const reportedFeatureType = meta.featureTypes.find(
    ({ typeValue }) => typeValue === 'reported'
  ) as ReportedFeatureType

  const reportedFeatures = data.features.filter((feature) =>
    Boolean(
      reportedFeatureType.isReportedField &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        feature.properties![reportedFeatureType.isReportedField] ===
          reportedFeatureType.isReportedValue
    )
  )

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} desktopView={desktopView} />
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <ReportedLayer
          reportedFeatures={reportedFeatures as Feature[]}
          reportedFeatureType={reportedFeatureType}
        />
      )}
    </>
  )
}

export default StreetlightLayer
