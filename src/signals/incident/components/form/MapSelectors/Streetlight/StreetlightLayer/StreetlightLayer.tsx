// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import { useContext } from 'react'
import type { FeatureCollection } from 'geojson'
import AssetLayer from '../../Asset/Selector/WfsLayer/AssetLayer'
import StatusLayer from '../../Asset/Selector/WfsLayer/StatusLayer'
import AssetSelectContext from '../../Asset/context'
import WfsDataContext from '../../Asset/Selector/WfsLayer/context'
import type { Feature } from '../../types'
import { getFeatureStatusType } from '../../Asset/Selector/WfsLayer/StatusLayer/utils'

export const StreetlightLayer = () => {
  const { meta } = useContext(AssetSelectContext)
  const data = useContext<FeatureCollection>(WfsDataContext)
  const featureStatusTypes = meta.featureStatusTypes || []
  const statusFeatures =
    data.features.filter(
      (feature) =>
        getFeatureStatusType(feature, featureStatusTypes) !== undefined
    ) || []

  return (
    <>
      <AssetLayer />
      {statusFeatures.length > 0 && featureStatusTypes && (
        <StatusLayer
          statusFeatures={statusFeatures as Feature[]}
          featureStatusTypes={featureStatusTypes}
        />
      )}
    </>
  )
}

export default StreetlightLayer
