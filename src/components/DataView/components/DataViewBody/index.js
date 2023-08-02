// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { useMemo } from 'react'

import PropTypes from 'prop-types'

import {
  StyledTR,
  StyledTD,
  StyledImg,
  StyledImageTD,
} from 'components/DataView/styled'
import onButtonPress from 'utils/on-button-press'

const DataViewBody = ({
  data,
  visibleColumns,
  onItemClick,
  primaryKeyColumn,
  numberOfColumns,
}) => {
  const dataColumnsMissing = useMemo(
    () => numberOfColumns - visibleColumns.length,
    [numberOfColumns, visibleColumns.length]
  )

  return (
    <tbody data-testid="data-view-body">
      {data.map((row, index) => (
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
          {visibleColumns.map((column, idx) => {
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

DataViewBody.defaultProps = {
  onItemClick: null,
  primaryKeyColumn: undefined,
}

DataViewBody.propTypes = {
  /** Array of data to be displayed */
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  /** Total number of columns in current view */
  numberOfColumns: PropTypes.number.isRequired,
  /** List of column names that should be displayed and in the order they should be displayed in */
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Name of the column that contains the value that is used to build the URL to navigate to on item click */
  primaryKeyColumn: PropTypes.string,
  /** Row click callback handler */
  onItemClick: PropTypes.func,
}

export default DataViewBody
