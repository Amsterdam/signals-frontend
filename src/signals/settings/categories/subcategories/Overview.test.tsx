// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mocked } from 'jest-mock'
import { useSelector } from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import * as constants from 'containers/App/constants'
import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectAllSubCategories } from 'models/categories/selectors'
import {
  SUBCATEGORY_URL,
  SUBCATEGORIES_PAGED_URL,
} from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import categories from 'utils/__tests__/fixtures/categories_structured.json'

import { OverviewContainer } from './Overview'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
  pageNum: '1',
}))

const pushSpy = jest.fn()
const useHistorySpy = { push: pushSpy } as any
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => useHistorySpy)

jest.mock('react-redux', () => {
  const actual = jest.requireActual('react-redux')
  return {
    ...actual,
    __esModule: true,
    useSelector: jest.fn(),
  }
})

const mockUseSelector = mocked(useSelector)

const scrollTo = jest.fn()
global.window.scrollTo = scrollTo

// eslint-disable-next-line
// @ts-ignore
constants.PAGE_SIZE = 2

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub)
const count = subCategories.length

const mockUserCan = jest.fn()
mockUseSelector.mockImplementation((selector) => {
  if (selector === makeSelectAllSubCategories) {
    return subCategories
  }
  if (selector === makeSelectUserCan) {
    return mockUserCan
  }
})

describe('signals/settings/categories/containers/Overview', () => {
  beforeEach(() => {
    pushSpy.mockReset()
    mockUserCan.mockReturnValue(true)
    // eslint-disable-next-line
    // @ts-ignore
    constants.PAGE_SIZE = 2
  })

  it('should render header', () => {
    render(withAppContext(<OverviewContainer />))

    expect(screen.getByText(`Subcategorieën (${count})`)).toBeInTheDocument()
  })

  it('should render paged data', () => {
    const firstCategory = subCategories[0]

    // eslint-disable-next-line
    // @ts-ignore
    const lastCategory = subCategories[constants.PAGE_SIZE - 1]

    // render the first page
    const { container, rerender } = render(
      withAppContext(<OverviewContainer />)
    )

    expect(
      container.querySelector(`tr[data-item-id="${firstCategory.fk}"]`)
    ).toBeInTheDocument()
    expect(
      container.querySelector(`tr[data-item-id="${lastCategory.fk}"]`)
    ).toBeInTheDocument()

    // // render the second page
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: '2',
    }))

    rerender(withAppContext(<OverviewContainer />))

    const secondPageFirstCategory = subCategories[constants.PAGE_SIZE + 1]
    const secondPageLastCategory = subCategories[constants.PAGE_SIZE * 2 - 1]

    expect(
      container.querySelector(
        `tr[data-item-id="${secondPageFirstCategory.fk}"]`
      )
    ).toBeInTheDocument()
    expect(
      container.querySelector(`tr[data-item-id="${secondPageLastCategory.fk}"]`)
    ).toBeInTheDocument()
  })

  it('should only render specific data columns', () => {
    render(withAppContext(<OverviewContainer />))

    expect(screen.getByText('Subcategorie')).toBeInTheDocument()
    expect(screen.getByText('Afhandeltermijn')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('should render pagination controls', () => {
    const { rerender, queryByTestId } = render(
      withAppContext(<OverviewContainer />)
    )

    expect(queryByTestId('pagination')).toBeInTheDocument()

    // eslint-disable-next-line
    // @ts-ignore
    constants.PAGE_SIZE = count + 1

    rerender(withAppContext(<OverviewContainer />))

    expect(queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('should push to the history stack and scroll to top on pagination item click', () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({
      pageNum: '1',
    }))

    render(withAppContext(<OverviewContainer />))

    const pageButton = screen.getByTestId('nextbutton')

    expect(scrollTo).not.toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()

    userEvent.click(pageButton)

    expect(pushSpy).toHaveBeenCalledTimes(1)
    expect(pushSpy).toHaveBeenCalledWith(`${SUBCATEGORIES_PAGED_URL}/2`)
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('should push on list item with an itemId click', async () => {
    const { container } = render(withAppContext(<OverviewContainer />))
    const itemId = 666

    let row: any

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(2)')
    })

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId

    expect(pushSpy).toHaveBeenCalledTimes(0)

    userEvent.click(row)

    expect(pushSpy).toHaveBeenCalledTimes(1)
    expect(pushSpy).toHaveBeenCalledWith(`${SUBCATEGORY_URL}/${itemId}`)

    // Remove 'itemId' and fire click event again.
    delete row.dataset.itemId

    userEvent.click(row)

    expect(pushSpy).toHaveBeenCalledTimes(1)

    // Set 'itemId' again and fire click event once more.
    row.dataset.itemId = itemId

    userEvent.click(row)

    expect(pushSpy).toHaveBeenCalledTimes(2)
  })

  it('should not push on list item click when permissions are insufficient', async () => {
    mockUserCan.mockReturnValue(false)
    const { container } = render(withAppContext(<OverviewContainer />))
    const itemId = 666

    let row: any

    await waitFor(() => {
      row = container.querySelector('tbody tr:nth-child(2)')
    })

    // Explicitly set an 'itemId' so that we can easily test against its value.
    row.dataset.itemId = itemId

    expect(pushSpy).not.toHaveBeenCalled()

    userEvent.click(row)

    expect(pushSpy).not.toHaveBeenCalled()
  })
})
