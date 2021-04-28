// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { StyledTable } from './styled'

import DataViewHeader from './components/DataViewHeader'
import DataViewBody from './components/DataViewBody'

const DataView = ({
  className,
  headers,
  filters,
  data,
  columnOrder,
  invisibleColumns,
  onItemClick,
  primaryKeyColumn,
}) => {
  const dataColumns = useMemo(() => {
    if (data.length) {
      if (columnOrder.length) {
        return columnOrder
      }

      return Object.keys(data[0])
    }

    return []
  }, [data, columnOrder])
  const visibleColumns = useMemo(
    () =>
      dataColumns.filter(
        (colHeader) => invisibleColumns.includes(colHeader) === false
      ),
    [dataColumns, invisibleColumns]
  )
  const numberOfColumns = useMemo(
    () => Math.max(...[headers.length, filters.length, visibleColumns.length]),
    [headers.length, filters.length, visibleColumns.length]
  )

  if (!numberOfColumns) return null

  return (
    <StyledTable data-testid="dataView" className={className}>
      {(headers.length > 0 || filters.length > 0) && (
        <DataViewHeader
          numberOfColumns={numberOfColumns}
          headers={headers}
          filters={filters}
        />
      )}
      {data.length > 0 && (
        <DataViewBody
          data={data}
          numberOfColumns={numberOfColumns}
          visibleColumns={visibleColumns}
          primaryKeyColumn={primaryKeyColumn}
          onItemClick={onItemClick}
        />
      )}
    </StyledTable>
  )
}

DataView.defaultProps = {
  className: '',
  headers: [],
  filters: [],
  data: [],
  columnOrder: [],
  invisibleColumns: [],
  onItemClick: null,
  primaryKeyColumn: undefined,
}

DataView.propTypes = {
  className: PropTypes.string,
  /** Array of headers to be displayed. Does not have to be the same as the column keys */
  headers: PropTypes.arrayOf(PropTypes.string),
  /** Array of filter nodes to be displayed in the supplied order */
  filters: PropTypes.node,
  /** Array of data to be displayed */
  data: PropTypes.arrayOf(PropTypes.shape({})),
  /** List of column names in the order of which they should be displayed */
  columnOrder: PropTypes.arrayOf(PropTypes.string),
  /** List of column names that should not be displayed */
  invisibleColumns: PropTypes.arrayOf(PropTypes.string),
  /** Row click callback handler */
  onItemClick: PropTypes.func,
  /** Name of the column that contains the value that is used to build the URL to navigate to on item click */
  primaryKeyColumn: PropTypes.string,
}

export default DataView
