// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { StyledTR, StyledTD } from 'components/DataView/styled'

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
    <tbody data-testid="dataViewBody">
      {data.map((row) => (
        <StyledTR
          key={JSON.stringify(row)}
          data-item-id={primaryKeyColumn && row[primaryKeyColumn]}
          onClick={onItemClick}
          data-testid="dataViewBodyRow"
        >
          {visibleColumns.map((column, idx) => (
            <StyledTD
              // eslint-disable-next-line react/no-array-index-key
              key={`${JSON.stringify(column)}${idx}`}
              data-testid="dataViewBodyRowValue"
            >
              {row[column]}
            </StyledTD>
          ))}
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
