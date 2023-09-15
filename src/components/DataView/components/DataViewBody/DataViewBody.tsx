// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { UIEvent } from 'react'
import { useMemo } from 'react'

import {
  StyledTR,
  StyledTD,
  StyledImg,
  StyledImageTD,
} from 'components/DataView/styled'
import onButtonPress from 'utils/on-button-press'

export interface DataViewBodyProps {
  data: []
  visibleColumns: string[]
  onItemClick: (e: UIEvent) => void
  primaryKeyColumn: number | undefined
  numberOfColumns: number
}

const DataViewBody = ({
  data,
  visibleColumns,
  onItemClick,
  primaryKeyColumn,
  numberOfColumns,
}: DataViewBodyProps) => {
  const dataColumnsMissing = useMemo(
    () => numberOfColumns - visibleColumns.length,
    [numberOfColumns, visibleColumns.length]
  )

  return (
    <tbody data-testid="data-view-body">
      {data.map((row: any, index: number) => (
        <StyledTR
          key={JSON.stringify(row) + index}
          data-item-id={primaryKeyColumn && row[primaryKeyColumn]}
          onClick={onItemClick}
          onKeyDown={(e) => {
            onButtonPress(e, () => onItemClick(e))
          }}
          tabIndex={0}
          role={'button'}
          data-testid="data-view-body-row"
        >
          {visibleColumns.map((column: string, idx: number) => {
            if (column === 'Icoon' && row[column] !== 'Niet ingesteld') {
              return (
                <StyledImageTD
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${JSON.stringify(column)}${idx}`}
                  data-testid="data-view-body-row-value"
                >
                  <StyledImg alt="Icoon" src={row[column]} />
                </StyledImageTD>
              )
            }

            return (
              <StyledTD
                // eslint-disable-next-line react/no-array-index-key
                key={`${JSON.stringify(column)}${idx}`}
                data-testid="data-view-body-row-value"
              >
                {row[column]}
              </StyledTD>
            )
          })}
          {dataColumnsMissing > 0 && (
            <StyledTD
              colSpan={dataColumnsMissing > 1 ? dataColumnsMissing : undefined}
            />
          )}
        </StyledTR>
      ))}
    </tbody>
  )
}

export default DataViewBody
