// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type {
  FeatureType,
  Item,
} from 'signals/incident/components/form/MapSelectors/Asset/types'
import AssetList from 'signals/incident/components/form/MapSelectors/Asset/AssetList'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'

export interface AssetListPreviewProps {
  value: Item[]
  featureTypes: FeatureType[]
}

const StyledAssetList = styled(AssetList)`
  margin-bottom: 0;
`

const AssetListPreview: FunctionComponent<AssetListPreviewProps> = ({
  value,
  featureTypes,
}) => <StyledAssetList selection={value} featureTypes={featureTypes} />
export default AssetListPreview
