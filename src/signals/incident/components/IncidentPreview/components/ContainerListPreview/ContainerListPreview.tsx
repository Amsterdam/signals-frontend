// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type {
  FeatureType,
  Item,
} from 'signals/incident/components/form/MapSelectors/Container/types'
import ContainerList from 'signals/incident/components/form/MapSelectors/Container/ContainerList'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

export interface ContainerListPreviewProps {
  value: Item[]
  featureTypes: FeatureType[]
}

const StyledContainerList = styled(ContainerList)`
  margin-bottom: 0;
`

const ContainerListPreview: FunctionComponent<ContainerListPreviewProps> = ({
  value,
  featureTypes,
}) => <StyledContainerList selection={value} featureTypes={featureTypes} />
export default ContainerListPreview
