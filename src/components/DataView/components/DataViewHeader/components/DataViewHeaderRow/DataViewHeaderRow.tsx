// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam

import type { ReactNode } from 'react'

import { StyledTH, StyledTR } from 'components/DataView/styled'

interface Props {
  nodes: ReactNode[]
  testId?: string
  spacer?: number
}

const DataViewHeaderRow = ({
  nodes,
  testId = 'data-view-header-row',
  spacer = 0,
}: Props) => (
  <StyledTR data-testid={testId}>
    {nodes.map((node, idx) => (
      // eslint-disable-next-line react/no-array-index-key
      <StyledTH key={idx} data-testid={`${testId}-heading`}>
        {node}
      </StyledTH>
    ))}
    {spacer > 0 && <StyledTH colSpan={spacer > 1 ? spacer : undefined} />}
  </StyledTR>
)

export default DataViewHeaderRow
