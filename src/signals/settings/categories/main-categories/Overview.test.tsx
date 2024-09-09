// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

// TODO: Typing is a mess here, should fix
// eslint-disable-next-line
// @ts-nocheck
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mocked } from 'jest-mock'
import { useSelector } from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectMainCategories } from 'models/categories/selectors'
import { BASE_URL, MAIN_CATEGORY_URL } from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import categories from 'utils/__tests__/fixtures/categories_structured.json'

import { OverviewContainer } from './Overview'

jest.mock('react-router-dom', () => {
  return {
    __esModule: true,
    ...jest.requireActual('react-router-dom'),
  }
})

const navigateSpy = jest.fn()

jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)

let mockMainCategories = [categories['wegen-verkeer-straatmeubilair']]

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux')
  return {
    ...actual,
    __esModule: true,
    useSelector: jest.fn(),
  }
})
const mockUserCan = jest.fn()

const mockUseSelector = mocked(useSelector)
mockUseSelector.mockImplementation((selector) => {
  if (selector === makeSelectMainCategories) {
    return mockMainCategories
  }
  if (selector === makeSelectUserCan) {
    return mockUserCan
  }
})

describe('OverviewContainer', () => {
  beforeEach(() => {
    mockMainCategories = [categories['wegen-verkeer-straatmeubilair']]
    jest.clearAllMocks()
  })

  it('should render correct data', () => {
    render(withAppContext(<OverviewContainer />))

    expect(
      screen.getByRole('heading', { name: 'Hoofdcategorieën (1)' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Terug naar instellingen' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', { name: 'Wegen, verkeer, straatmeubilair' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('cell', {
        name: 'Wegen, verkeer, straatmeubilair - publiek',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Icoon' })).toBeInTheDocument()
  })

  it('should render loading when categories are not there', () => {
    // eslint-disable-next-line
    // @ts-ignore
    mockMainCategories = null

    render(withAppContext(<OverviewContainer />))

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should go to detail page on click', async () => {
    mockUserCan.mockReturnValueOnce(true)
    const { container } = render(withAppContext(<OverviewContainer />))

    let row: any

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(1)')
    })

    expect(navigateSpy).toHaveBeenCalledTimes(0)

    userEvent.click(row)

    expect(navigateSpy).toHaveBeenCalledTimes(1)
    expect(navigateSpy).toHaveBeenCalledWith(
      `${BASE_URL}/${MAIN_CATEGORY_URL}/80`
    )
  })

  it('should not push on list item click when permissions are insufficient', async () => {
    mockUserCan.mockReturnValueOnce(false)
    const { container } = render(withAppContext(<OverviewContainer />))

    let row: any

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(1)')
    })

    expect(navigateSpy).not.toHaveBeenCalled()

    userEvent.click(row)

    expect(navigateSpy).toHaveBeenCalledTimes(0)
  })
})
