// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 - 2022 Gemeente Amsterdam
import { useContext } from 'react'

import type { FeatureCollection } from 'geojson'

import AssetSelectContext from '../../Asset/context'
import StatusLayer from '../../Asset/Selector_v2_removeafterfinishepic5440/StatusLayer'
import { getFeatureStatusType } from '../../Asset/Selector_v2_removeafterfinishepic5440/StatusLayer/utils'
import AssetLayer from '../../Asset/Selector_v2_removeafterfinishepic5440/WfsLayer/AssetLayer'
import WfsDataContext from '../../Asset/Selector_v2_removeafterfinishepic5440/WfsLayer/context'
import type { Feature } from '../../types'

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
