// SPDX-License-Identifier MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { screen, render, within, fireEvent } from '@testing-library/react'

import data from 'utils/__tests__/fixtures/filteredUserData.json'

import DataView from '..'
import { sortAlphabetic } from '../../../utils/sortAlphabetic'

const TEXT_FILTER = 'test filter'
const TEXT_HEADER = 'test header'
const renderDiv = (text) => <div>{text}</div>
const createFilledArray = (num, filling = null) => new Array(num).fill(filling)
const createFilters = (num) => createFilledArray(num, renderDiv(TEXT_FILTER))
const createHeaders = (num) => createFilledArray(num, TEXT_HEADER)
const headers = Object.keys(data[0])
const filters = createFilters(headers.length)

const sortAlphabeticReversed = (a, b) => {
  const _a = a.toLowerCase()
  const _b = b.toLowerCase()

  // eslint-disable-next-line no-nested-ternary
  return _a < _b ? 1 : _a > _b ? -1 : 0
}

const dataViewWithProps = (props = {}) => <DataView {...props} />

describe('DataView with and without headers, filter and/or data', () => {
  it('should render correctly', () => {
    const { container } = render(dataViewWithProps())

    expect(container).toBeInTheDocument()
  })

  it('should not render DataView without props', () => {
    const { queryByTestId } = render(dataViewWithProps())

    expect(queryByTestId('dataView')).not.toBeInTheDocument()
  })

  it('should not render DataView without headers, filters or data', () => {
    const { queryByTestId } = render(
      dataViewWithProps({
        columnOrder: headers,
        invisibleColumns: headers.slice(1, 3),
        primaryKeyColumn: headers[0],
      })
    )

    expect(queryByTestId('dataView')).not.toBeInTheDocument()
  })

  it('should render headers and filters before data', () => {
    const { getByTestId } = render(
      dataViewWithProps({ headers, filters, data })
    )

    const dataView = getByTestId('data-view')

    expect(dataView.childNodes).toHaveLength(2)

    const order = [...dataView.childNodes].reduce(
      (acc, curr) => [...acc, curr.dataset.testid],
      []
    )

    expect(order).toEqual(['data-view-header', 'data-view-body'])
  })

  it('should render headers before filters', () => {
    const { getByTestId } = render(
      dataViewWithProps({ headers, filters, data })
    )

    const dataViewHeader = getByTestId('data-view-header')

    const order = [...dataViewHeader.childNodes].reduce(
      (acc, curr) => [...acc, curr.dataset.testid],
      []
    )

    expect(dataViewHeader.childNodes).toHaveLength(2)
    expect(order).toEqual(['data-view-headers-row', 'data-view-filters-row'])
  })

  it('should render without data and without headers or filters', () => {
    const { rerender, getByTestId } = render(
      dataViewWithProps({ headers, filters })
    )

    const dataView = getByTestId('data-view')

    expect(dataView.childNodes).toHaveLength(1)
    expect(dataView.childNodes[0].dataset.testid).toBe('data-view-header')

    rerender(dataViewWithProps({ data }))

    expect(dataView.childNodes).toHaveLength(1)
    expect(dataView.childNodes[0].dataset.testid).toBe('data-view-body')
  })

  it('should render with only headers or only filters', () => {
    const { rerender, getByTestId } = render(
      dataViewWithProps({ headers, data })
    )

    const dataView = getByTestId('data-view')
    const dataViewHeader = getByTestId('data-view-header')

    expect(dataView.childNodes).toHaveLength(2)
    expect(dataViewHeader.childNodes).toHaveLength(1)
    expect(dataViewHeader.childNodes[0].dataset.testid).toBe(
      'data-view-headers-row'
    )

    rerender(dataViewWithProps({ filters, data }))

    expect(dataView.childNodes).toHaveLength(2)
    expect(dataViewHeader.childNodes).toHaveLength(1)
    expect(dataViewHeader.childNodes[0].dataset.testid).toBe(
      'data-view-filters-row'
    )
  })
})

describe('DataView with correct number of columns', () => {
  it('should render data view with correct number of columns', () => {
    const MAX_NUMBER_OF_COLUMNS = 7
    const createDataValues = (num) => {
      const columns = createFilledArray(num)

      return columns.reduce(
        (acc, curr, idx) => ({
          ...acc,
          [`column_${idx + 1}`]: `value_${idx + 1}`,
        }),
        {}
      )
    }

    let testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS)
    let testFilters = createFilters(MAX_NUMBER_OF_COLUMNS)
    let dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS)
    let testData = [dataValues]

    const { rerender, getByTestId, queryAllByTestId } = render(
      dataViewWithProps({ headers: testHeaders })
    )

    let headersRow = getByTestId('data-view-headers-row')

    expect(headersRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    rerender(dataViewWithProps({ filters: testFilters }))

    let filtersRow = getByTestId('data-view-filters-row')

    expect(filtersRow).toBeInTheDocument()
    expect(filtersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    rerender(dataViewWithProps({ data: testData }))

    let dataRow = getByTestId('data-view-body-row')

    expect(dataRow).toBeInTheDocument()
    expect(dataRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS)
    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS - 3)

    rerender(dataViewWithProps({ headers: testHeaders, filters: testFilters }))

    headersRow = getByTestId('data-view-headers-row')
    filtersRow = getByTestId('data-view-filters-row')

    expect(headersRow).toBeInTheDocument()
    expect(filtersRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(filtersRow.childNodes).toHaveLength(testFilters.length + 1)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      testFilters.length
    )
    expect(filtersRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - testFilters.length)
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS)
    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS - 1)

    rerender(dataViewWithProps({ headers: testHeaders, filters: testFilters }))

    headersRow = getByTestId('data-view-headers-row')
    filtersRow = getByTestId('data-view-filters-row')

    expect(headersRow).toBeInTheDocument()
    expect(filtersRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(filtersRow.childNodes).toHaveLength(testFilters.length + 1)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      testFilters.length
    )
    expect(filtersRow.lastChild).not.toHaveAttribute('colspan')

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS - 3)
    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS)

    rerender(dataViewWithProps({ headers: testHeaders, filters: testFilters }))

    headersRow = getByTestId('data-view-headers-row')
    filtersRow = getByTestId('data-view-filters-row')

    expect(headersRow).toBeInTheDocument()
    expect(filtersRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(testHeaders.length + 1)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      testHeaders.length
    )
    expect(headersRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - testHeaders.length)
    )
    expect(filtersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS - 1)
    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS)

    rerender(dataViewWithProps({ headers: testHeaders, filters: testFilters }))

    headersRow = getByTestId('data-view-headers-row')
    filtersRow = getByTestId('data-view-filters-row')

    expect(headersRow).toBeInTheDocument()
    expect(filtersRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(testHeaders.length + 1)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      testHeaders.length
    )
    expect(headersRow.lastChild).not.toHaveAttribute('colspan')
    expect(filtersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS - 3)
    testData = [dataValues]

    rerender(dataViewWithProps({ headers: testHeaders, data: testData }))

    headersRow = getByTestId('data-view-headers-row')
    dataRow = getByTestId('data-view-body-row')

    expect(headersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(dataRow.childNodes).toHaveLength(Object.keys(dataValues).length + 1)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      Object.keys(dataValues).length
    )
    expect(dataRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - Object.keys(dataValues).length)
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS - 1)
    testData = [dataValues]

    rerender(dataViewWithProps({ headers: testHeaders, data: testData }))

    headersRow = getByTestId('data-view-headers-row')
    dataRow = getByTestId('data-view-body-row')

    expect(headersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(dataRow.childNodes).toHaveLength(Object.keys(dataValues).length + 1)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      Object.keys(dataValues).length
    )
    expect(dataRow.lastChild).not.toHaveAttribute('colspan')

    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS - 3)
    testData = [dataValues]

    rerender(dataViewWithProps({ filters: testFilters, data: testData }))

    filtersRow = getByTestId('data-view-filters-row')
    dataRow = getByTestId('data-view-body-row')

    expect(filtersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(filtersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(dataRow.childNodes).toHaveLength(Object.keys(dataValues).length + 1)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      Object.keys(dataValues).length
    )
    expect(dataRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - Object.keys(dataValues).length)
    )

    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS - 1)
    testData = [dataValues]

    rerender(dataViewWithProps({ filters: testFilters, data: testData }))

    filtersRow = getByTestId('data-view-filters-row')
    dataRow = getByTestId('data-view-body-row')

    expect(filtersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(filtersRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
    expect(dataRow.childNodes).toHaveLength(Object.keys(dataValues).length + 1)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      Object.keys(dataValues).length
    )
    expect(dataRow.lastChild).not.toHaveAttribute('colspan')

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS - 3)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS)
    testData = [dataValues]

    rerender(dataViewWithProps({ headers: testHeaders, data: testData }))

    headersRow = getByTestId('data-view-headers-row')
    dataRow = getByTestId('data-view-body-row')

    expect(headersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(testHeaders.length + 1)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      testHeaders.length
    )
    expect(headersRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - testHeaders.length)
    )
    expect(dataRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testHeaders = createHeaders(MAX_NUMBER_OF_COLUMNS - 1)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS)
    testData = [dataValues]

    rerender(dataViewWithProps({ headers: testHeaders, data: testData }))

    headersRow = getByTestId('data-view-headers-row')
    dataRow = getByTestId('data-view-body-row')

    expect(headersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(headersRow.childNodes).toHaveLength(testHeaders.length + 1)
    expect(queryAllByTestId('data-view-headers-row-heading')).toHaveLength(
      testHeaders.length
    )
    expect(headersRow.lastChild).not.toHaveAttribute('colspan')
    expect(dataRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS - 3)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS)
    testData = [dataValues]

    rerender(dataViewWithProps({ filters: testFilters, data: testData }))

    filtersRow = getByTestId('data-view-filters-row')
    dataRow = getByTestId('data-view-body-row')

    expect(filtersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(filtersRow.childNodes).toHaveLength(testFilters.length + 1)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      testFilters.length
    )
    expect(filtersRow.lastChild).toHaveAttribute(
      'colspan',
      String(MAX_NUMBER_OF_COLUMNS - testFilters.length)
    )
    expect(dataRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )

    testFilters = createFilters(MAX_NUMBER_OF_COLUMNS - 1)
    dataValues = createDataValues(MAX_NUMBER_OF_COLUMNS)
    testData = [dataValues]

    rerender(dataViewWithProps({ filters: testFilters, data: testData }))

    filtersRow = getByTestId('data-view-filters-row')
    dataRow = getByTestId('data-view-body-row')

    expect(filtersRow).toBeInTheDocument()
    expect(dataRow).toBeInTheDocument()
    expect(filtersRow.childNodes).toHaveLength(testFilters.length + 1)
    expect(queryAllByTestId('data-view-filters-row-heading')).toHaveLength(
      testFilters.length
    )
    expect(filtersRow.lastChild).not.toHaveAttribute('colspan')
    expect(dataRow.childNodes).toHaveLength(MAX_NUMBER_OF_COLUMNS)
    expect(queryAllByTestId('data-view-body-row-value')).toHaveLength(
      MAX_NUMBER_OF_COLUMNS
    )
  })
})

describe('DataView with data', () => {
  it('should render data correctly', () => {
    const { getByTestId, queryAllByTestId, getByText } = render(
      dataViewWithProps({ data })
    )

    expect(getByTestId('data-view-body')).toBeInTheDocument()
    expect(queryAllByTestId('data-view-body-row')).toHaveLength(data.length)
    data.forEach((item) => {
      // Only checking if we can at least find all IDs in the document.
      expect(getByText(String(item.id))).toBeInTheDocument()
    })
  })

  it('should render correct number of columns and in correct column order', () => {
    const alphabetic = [...headers].sort(sortAlphabetic)
    const alphabeticReversed = [...headers].sort(sortAlphabeticReversed)
    const expectOrder =
      (order, negate = false) =>
      (row, rowIDX) =>
        row.childNodes.forEach((column, idx) => {
          // eslint-disable-next-line
          const expectObj = negate ? expect(column).not : expect(column)
          const check =
            data[rowIDX][order[idx]] === undefined
              ? ''
              : data[rowIDX][order[idx]]
          const negativeCheck = data[rowIDX][order[idx]]

          expectObj.toHaveTextContent(negate ? negativeCheck : check)
        })
    const { queryAllByTestId, rerender } = render(dataViewWithProps({ data }))

    const allDataRows = [...queryAllByTestId('data-view-body-row')]

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(headers.length)
    )
    allDataRows.forEach(expectOrder(alphabetic, true)) // Expect order not to match 'alphabetic'.

    rerender(dataViewWithProps({ data, columnOrder: alphabetic }))

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(headers.length)
    )
    allDataRows.forEach(expectOrder(alphabetic))

    rerender(dataViewWithProps({ data, columnOrder: alphabeticReversed }))

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(headers.length)
    )
    allDataRows.forEach(expectOrder(alphabeticReversed))

    const alphabeticReversedWithNonExistingColumns = [
      ...alphabeticReversed,
      'non_existing_1',
      'non_existing_2',
    ]

    rerender(
      dataViewWithProps({
        data,
        columnOrder: alphabeticReversedWithNonExistingColumns,
      })
    )

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(
        alphabeticReversedWithNonExistingColumns.length
      )
    )
    allDataRows.forEach(expectOrder(alphabeticReversedWithNonExistingColumns))
    allDataRows.forEach(expectOrder(alphabeticReversed)) // This should have the same order.

    const allNonExistingColumns = ['non_existing_1', 'non_existing_2']

    rerender(dataViewWithProps({ data, columnOrder: allNonExistingColumns }))

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(allNonExistingColumns.length)
    )
    allDataRows.forEach(expectOrder(allNonExistingColumns))
  })

  it('should not render invisible columns', () => {
    const invisibleColumns = headers.slice(0, 2)
    const { queryAllByTestId, rerender } = render(dataViewWithProps({ data }))

    const allDataRows = [...queryAllByTestId('data-view-body-row')]

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(headers.length)
    )

    rerender(dataViewWithProps({ data, invisibleColumns }))

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(
        headers.length - invisibleColumns.length
      )
    )
    allDataRows.forEach((row, rowIDX) =>
      invisibleColumns.forEach((invisibleColumn) => {
        expect(
          within(row).queryByText(String(data[rowIDX][invisibleColumn]))
        ).toBeNull()
      })
    )

    const columnOrder = ['non_existing_1', ...headers, 'non_existing_2']

    rerender(dataViewWithProps({ data, columnOrder, invisibleColumns }))

    expect(allDataRows).toHaveLength(data.length)
    allDataRows.forEach((row) =>
      expect(row.childNodes).toHaveLength(
        headers.length - invisibleColumns.length + 2
      )
    )
    allDataRows.forEach((row, rowIDX) =>
      invisibleColumns.forEach((invisibleColumn) => {
        expect(
          within(row).queryByText(String(data[rowIDX][invisibleColumn]))
        ).toBeNull()
      })
    )
  })

  it('should render with onItemClick and primaryKeyColumn property', () => {
    const onItemClickHandler = jest.fn()
    const { queryAllByTestId, rerender } = render(dataViewWithProps({ data }))

    const allRows = queryAllByTestId('data-view-body-row')

    fireEvent.click(allRows[0])

    expect(onItemClickHandler).toHaveBeenCalledTimes(0)
    allRows.forEach((row) => expect(row.dataset.itemId).toBeUndefined())

    rerender(dataViewWithProps({ data, onItemClick: onItemClickHandler }))

    expect(onItemClickHandler).toHaveBeenCalledTimes(0)

    fireEvent.click(allRows[0])

    expect(onItemClickHandler).toHaveBeenCalledTimes(1)

    rerender(
      dataViewWithProps({
        data,
        onItemClick: onItemClickHandler,
        primaryKeyColumn: headers[1],
      })
    )

    fireEvent.click(allRows[0])

    expect(onItemClickHandler).toHaveBeenCalledTimes(2)
    allRows.forEach((row, rowIDX) =>
      expect(row.dataset.itemId).toBe(String(data[rowIDX][headers[1]]))
    )

    rerender(
      dataViewWithProps({
        data,
        onItemClick: onItemClickHandler,
        primaryKeyColumn: headers[0],
      })
    )

    fireEvent.click(allRows[0])

    expect(onItemClickHandler).toHaveBeenCalledTimes(3)
    allRows.forEach((row, rowIDX) =>
      expect(row.dataset.itemId).toBe(String(data[rowIDX][headers[0]]))
    )

    onItemClickHandler.mockClear()

    rerender(
      dataViewWithProps({
        data,
        onItemClick: onItemClickHandler,
        primaryKeyColumn: headers[0],
      })
    )

    fireEvent.keyDown(allRows[0], { key: 'Enter', code: 13, keyCode: 13 })

    expect(onItemClickHandler).toHaveBeenCalledTimes(1)
    allRows.forEach((row, rowIDX) =>
      expect(row.dataset.itemId).toBe(String(data[rowIDX][headers[0]]))
    )
  })

  it('should render icon if available', () => {
    const onItemClickHandler = jest.fn()

    const dataWithIcon = [
      {
        'Openbare Naam': 'hoofdcategorie - openbare naame',
        fk: '177',
        Hoofdcategorie: 'hoofdcategorie test',
        Icoon:
          'https://siaweuaaks.blob.core.windows.net/files/icons/categories/0-hoofdcategorie-test/glas-icon.svg?se=2023-04-25T15%3A16%3A27Z&sp=r&sv=2021-08-06&sr=b&sig=GtCGkYzJhlkzlRrVAShohBuCQ0mq%2BojItkjJvPRWFBY%3D',
        id: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/0-hoofdcategorie-test',
      },
      {
        'Openbare Naam': 'Afval',
        fk: '156',
        Hoofdcategorie: 'Afval',
        Icoon: 'Niet ingesteld',
        id: 'https://acc.api.meldingen.amsterdam.nl/signals/v1/public/terms/categories/afval',
      },
    ]

    render(
      dataViewWithProps({
        data: dataWithIcon,
        onItemClick: onItemClickHandler,
        primaryKeyColumn: headers[1],
      })
    )

    expect(screen.getByRole('img', { name: 'Icoon' })).toBeInTheDocument()
    expect(screen.getByText('Niet ingesteld')).toBeInTheDocument()
  })
})
