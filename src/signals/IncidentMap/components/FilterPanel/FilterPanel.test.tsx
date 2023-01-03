/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configuration from 'shared/services/configuration/configuration'

import useFetch from '../../../../hooks/useFetch'
import type { Filter, SubCategory } from '../../types'
import {
  get,
  useFetchResponse,
  fetchCategoriesResponse,
  mockFiltersLong,
} from '../__test__'
import type { Props } from './FilterPanel'
import { FilterPanel } from './FilterPanel'

jest.mock('hooks/useFetch')

const mockSetFilters = jest.fn()
const mockSetMapFilter = jest.fn()

const defaultProps: Props = {
  filters: [],
  setFilters: mockSetFilters,
  setMapMessage: mockSetMapFilter,
}

const renderFilterPanel = (props: Partial<Props> = {}) =>
  render(<FilterPanel {...defaultProps} {...props} />)

describe('FilterPanel', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('get categories and set filters', () => {
    const fetchResponseWithFilters = {
      ...useFetchResponse,
      data: fetchCategoriesResponse,
    }

    jest.mocked(useFetch).mockImplementation(() => fetchResponseWithFilters)
    renderFilterPanel()

    expect(get).toBeCalledWith(configuration.CATEGORIES_ENDPOINT)
    expect(get).toBeCalledTimes(1)

    expect(mockSetFilters).toBeCalledTimes(1)
  })

  it('should render the filter panel', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFiltersLong })

    expect(
      screen.getByRole('heading', { name: 'Filter op onderwerp' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('checkbox', { name: /Openbaar groen en water/ })
    ).toBeInTheDocument()
  })

  it('should set a MapMessage when an error is thrown', () => {
    const fetchResponseWithError = {
      ...useFetchResponse,
      error: new Error(),
    }

    jest.mocked(useFetch).mockImplementation(() => fetchResponseWithError)
    renderFilterPanel()

    expect(mockSetMapFilter).toBeCalledWith(
      'Er konden geen filter categorieën worden opgehaald.'
    )
  })

  it('should set all subCategories.filterActive to false after setting mainCategory.filterActive to false', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFiltersLong })
    const testCategory = 'Afval'
    const checkbox = screen.getByTestId(testCategory)

    userEvent.click(checkbox)

    // Check to see if subCategory.filterActive has value false after setting mainCategory.filterActive to false. In
    // mockFilters all filterActives of all categories are initially set to true.
    mockSetFilters.mock.calls[0][0]
      .filter((filter: Filter) => filter.name === testCategory)
      .forEach((filter: Filter) => {
        expect(filter.filterActive).toBe(false)
        filter.subCategories?.forEach((subCategory: SubCategory) => {
          expect(subCategory.filterActive).toBe(false)
        })
      })
  })

  it('should set toggle a main category without subcategories', () => {
    const fetchResponseWithFilters = {
      ...useFetchResponse,
      data: fetchCategoriesResponse,
    }

    jest.mocked(useFetch).mockImplementation(() => fetchResponseWithFilters)

    renderFilterPanel({ filters: mockFiltersLong })

    const testCategory = 'Openbaar groen en water'

    const checkbox = screen.getByTestId(testCategory)

    userEvent.click(checkbox)

    expect(
      mockSetFilters.mock.calls[1][0].find(
        (filter: Filter) => filter.name === testCategory
      ).filterActive
    ).toBe(false)
  })

  it('should not render anything when filters are empty', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    const { container } = renderFilterPanel()

    expect(container.firstChild).toBeNull()
  })

  it('should not render anything when there are no incidents of that category', () => {
    const mockFiltersNotinIncident = [
      {
        name: 'NoIncident',
        _display: 'NoIncident',
        filterActive: true,
        slug: 'mockSlug',
        icon: '',
        incidentsCount: 1,
      },
      {
        name: 'NoIncident2',
        _display: 'NoIncident2',
        filterActive: true,
        slug: 'mockSlug2',
        icon: '',
        incidentsCount: 0,
      },
    ]

    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFiltersNotinIncident })

    expect(
      screen.queryByRole('checkbox', { name: 'icon NoIncident2' })
    ).not.toBeInTheDocument()
  })
})
