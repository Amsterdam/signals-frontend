// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'

export const ClockLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const reportedFeatureType = () => {
    return meta.featureTypes.find(({ typeValue }) => typeValue === 'reported')
  }

  // Only clock features that are reported
  const reportedFeatures = data.features.filter(
    (feature) =>
      feature.properties?.meldingstatus === 1 &&
      feature.properties?.objecttype === 1
  )

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} desktopView={desktopView} />
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <ReportedLayer
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          reportedFeatures={reportedFeatures}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          reportedFeatureType={reportedFeatureType}
        />
      )}
    </>
  )
}

export default ClockLayer
