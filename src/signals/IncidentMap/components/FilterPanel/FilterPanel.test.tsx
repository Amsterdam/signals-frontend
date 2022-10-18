/* SPDX-License-Identifier: MPL-2.0 */
/* Copyright (C) 2022 Gemeente Amsterdam */
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configuration from 'shared/services/configuration/configuration'

import useFetch from '../../../../hooks/useFetch'
import {
  get,
  useFetchResponse,
  fetchCategoriesResponse,
  mockFilters,
} from '../__test__'
import type { Props } from './FilterPanel'
import { FilterPanel } from './FilterPanel'

jest.mock('hooks/useFetch')

const mockSetFilters = jest.fn()
const mockSetMapFilter = jest.fn()
const mockToggleFilter = jest.fn()

const defaultProps: Props = {
  filters: [],
  setFilters: mockSetFilters,
  setMapMessage: mockSetMapFilter,
  toggleFilter: mockToggleFilter,
}

const renderFilterPanel = (props: Partial<Props> = {}) =>
  render(<FilterPanel {...defaultProps} {...props} />)

describe('FilterPanel', () => {
  it('get categories and set filters', () => {
    const fetchResponseWithFilters = {
      ...useFetchResponse,
      data: fetchCategoriesResponse,
    }

    jest.mocked(useFetch).mockImplementation(() => fetchResponseWithFilters)
    renderFilterPanel()

    expect(get).toBeCalledWith(configuration.CATEGORIES_ENDPOINT)
    expect(get).toBeCalledTimes(1)

    expect(mockSetFilters).toBeCalledWith(mockFilters)
  })

  it('should render the filter panel', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFilters })

    expect(
      screen.getByRole('heading', { name: 'Filter op onderwerp' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('checkbox', { name: 'icon Openbaar groen en water' })
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

  it('should unset a filter when clicked', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFilters })

    const checkbox = screen.getByRole('checkbox', {
      name: 'icon Openbaar groen en water',
    })
    userEvent.click(checkbox)

    expect(mockToggleFilter).toHaveBeenCalledTimes(1)
  })

  it('should not render anything when filters are empty', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    const { container } = renderFilterPanel()

    expect(container.firstChild).toBeNull()
  })
})
