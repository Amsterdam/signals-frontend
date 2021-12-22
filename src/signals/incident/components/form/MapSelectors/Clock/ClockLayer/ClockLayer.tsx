// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useMatchMedia } from '@amsterdam/asc-ui/lib/utils/hooks'
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import ReportedLayer from '../../Asset/Selector/WfsLayer/ReportedLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature, FeatureType } from '../../Asset/types'

const CLOCK = 1
const REPORTED = 1

export const ClockLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)

  const [desktopView] = useMatchMedia({ minBreakpoint: 'tabletM' })

  const reportedFeatureType = meta.featureTypes.find(
    ({ typeValue }) => typeValue === 'reported'
  )

  const reportedFeatures = data.features.filter(
    (feature) =>
      feature.properties?.meldingstatus === REPORTED &&
      feature.properties?.objecttype === CLOCK
  )

  return (
    <>
      <AssetLayer featureTypes={meta.featureTypes} desktopView={desktopView} />
      {reportedFeatures.length > 0 && reportedFeatureType && (
        <ReportedLayer
          reportedFeatures={reportedFeatures as Feature[]}
          reportedFeatureType={reportedFeatureType as FeatureType}
        />
      )}
    </>
  )
}

export default ClockLayer