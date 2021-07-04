// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import SelectionList from 'signals/incident/components/form/MapSelectors/Caterpillar/SelectionList'
import { FunctionComponent } from 'react'
import styled from 'styled-components'
import type {
  Meta,
  Item,
} from 'signals/incident/components/form/MapSelectors/Caterpillar/types'

export interface CaterpillarListPreviewProps {
  value: Item[]
  meta: Meta
}

const StyledSelectionList = styled(SelectionList)`
  margin-bottom: 0;
`

const CaterpillarListPreview: FunctionComponent<CaterpillarListPreviewProps> =
  ({ value, meta }) => (
    <StyledSelectionList
      selection={value}
      featureTypes={meta.featureTypes}
      icons={meta.icons}
    />
  )
export default CaterpillarListPreview
