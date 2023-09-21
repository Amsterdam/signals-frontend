// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { StyledTHead } from 'components/DataView/styled'

import DataViewHeaderRow from './components/DataViewHeaderRow'

interface Props {
  numberOfColumns: number
  headers?: string[]
  filters?: ReactNode[]
}
const DataViewHeader = ({
  numberOfColumns,
  headers = [],
  filters = [],
}: Props) => {
  const headersMissing = useMemo(
    () => numberOfColumns - headers.length,
    [numberOfColumns, headers.length]
  )
  const filtersMissing = useMemo(
    () => numberOfColumns - filters.length,
    [numberOfColumns, filters.length]
  )

  return (
    <StyledTHead data-testid="data-view-header">
      {headers.length > 0 && (
        <DataViewHeaderRow
          nodes={headers}
          spacer={headersMissing}
          testId="data-view-headers-row"
        />
      )}
      {filters.length > 0 && (
        <DataViewHeaderRow
          nodes={filters}
          spacer={filtersMissing}
          testId="data-view-filters-row"
        />
      )}
    </StyledTHead>
  )
}

export default DataViewHeader
