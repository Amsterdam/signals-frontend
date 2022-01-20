// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import styled from 'styled-components'

import type { AssetListProps } from 'signals/incident/components/form/MapSelectors/Asset/AssetList/AssetList'
import type { Item } from 'signals/incident/components/form/MapSelectors/types'

import AssetList from 'signals/incident/components/form/MapSelectors/Asset/AssetList'

const StyledAssetList = styled(AssetList)`
  margin-bottom: 0;
`

export interface AssetListPreviewProps
  extends Omit<AssetListProps, 'selection'> {
  value: Item
}

const AssetListPreview: FunctionComponent<AssetListPreviewProps> = ({
  value,
  ...props
}) => <StyledAssetList {...props} selection={value} />

export default AssetListPreview
