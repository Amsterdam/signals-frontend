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
import { updateFilterCategory } from '../utils'
import type { Props } from './FilterPanel'
import { FilterPanel } from './FilterPanel'

jest.mock('hooks/useFetch')

jest.mock('../utils', () => ({
  updateFilterCategory: jest.fn(),
}))

const mockSetFilters = jest.fn()
const mockSetMapFilter = jest.fn()

const defaultProps: Props = {
  filters: [],
  setFilters: mockSetFilters,
  setMapMessage: mockSetMapFilter,
  setPin: jest.fn(),
  setAddress: jest.fn(),
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
      screen.getByRole('checkbox', { name: 'Civiele Constructies' })
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

  it('should close the panel on close button', () => {
    jest.spyOn(global.window, 'dispatchEvent')
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFilters })

    const toggleButton = screen.getByRole('button', {
      name: 'Sluit filter panel',
    })

    expect(toggleButton).toBeInTheDocument()

    userEvent.click(toggleButton)

    // the event is also dispatched on initialization, therefore 2 times.
    expect(global.window.dispatchEvent).toBeCalledTimes(2)
    expect(
      screen.getByRole('button', {
        name: 'Open filter panel',
      })
    ).toBeInTheDocument()
  })

  it('should unset a filter when clicked', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    renderFilterPanel({ filters: mockFilters })

    const checkbox = screen.getByRole('checkbox', {
      name: 'Openbaar groen en water',
    })
    userEvent.click(checkbox)

    expect(updateFilterCategory).toHaveBeenCalledTimes(1)
  })

  it('should not render anything when filters are empty', () => {
    jest.mocked(useFetch).mockImplementation(() => useFetchResponse)
    const { container } = renderFilterPanel()

    expect(container.firstChild).toBeNull()
  })
})
