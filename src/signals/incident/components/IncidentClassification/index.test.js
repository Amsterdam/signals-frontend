// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import { render } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'
import * as reactRedux from 'react-redux'
import configuration from 'shared/services/configuration/configuration'
import { history, withAppContext } from 'test/utils'
import { act } from 'react-dom/test-utils'
import { setClassification } from 'signals/incident/containers/IncidentContainer/actions'
import * as auth from 'shared/services/auth/auth'
import IncidentClassification from '.'

jest.mock('shared/services/auth/auth')
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

const dispatch = jest.fn()
const testUnhappyWorkflow = async (setFetchResult) => {
  const category = 'foo'
  const subcategory = 'bar'
  jest
    .spyOn(reactRouterDom, 'useParams')
    .mockImplementation(() => ({ category, subcategory }))

  setFetchResult()

  act(() => history.push('/aaa'))

  const { findByTestId } = render(withAppContext(<IncidentClassification />))

  expect(fetch).toHaveBeenCalledWith(
    `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`,
    expect.objectContaining({
      method: 'GET',
    })
  )

  await findByTestId('loadingIndicator')
  expect(dispatch).not.toHaveBeenCalled()
  expect(history.location.pathname).toEqual('/')
}

describe('signals/incident/components/IncidentClassification', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => false)

    fetch.resetMocks()
    dispatch.mockReset()
  })

  it('sets the subcategory', async () => {
    const category = 'foo'
    const subcategory = 'bar'
    const mockSubcategory = {
      _links: { self: { href: 'url-path' } },
      handling_message: 'the handling message',
      slug: 'slug',
      name: 'name',
    }
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ category, subcategory }))
    fetch.mockResponseOnce(
      JSON.stringify({ ...mockSubcategory, is_active: true })
    )

    act(() => history.push('/initial-location'))

    const { findByTestId } = render(withAppContext(<IncidentClassification />))

    expect(fetch).toHaveBeenCalledWith(
      `${configuration.CATEGORIES_ENDPOINT}${category}/sub_categories/${subcategory}`,
      expect.objectContaining({
        method: 'GET',
      })
    )

    await findByTestId('loadingIndicator')
    const {
      _links: {
        self: { href: id },
      },
      handling_message,
      slug,
      name,
    } = mockSubcategory
    const testCategory = {
      category,
      subcategory,
      classification: {
        id,
        slug,
        name,
      },
      handling_message,
    }
    expect(dispatch).toHaveBeenCalledWith(setClassification(testCategory))
    expect(history.location.pathname).toEqual('/')
  })

  it("doesn't set the category and subcategory when an error occurs", async () => {
    const setFetchResult = () => {
      fetch.mockRejectOnce(new Error())
    }

    await testUnhappyWorkflow(setFetchResult)
  })

  it("doesn't set the category and subcategory when category is not active", async () => {
    const setFetchResult = () => {
      fetch.mockResponseOnce(JSON.stringify({ is_active: false }))
    }

    await testUnhappyWorkflow(setFetchResult)
  })

  it("doesn't set the category and subcategory when a bad request is done", async () => {
    const setFetchResult = () => {
      fetch.mockResponseOnce(JSON.stringify({}), { status: 400 })
    }

    await testUnhappyWorkflow(setFetchResult)
  })

  it("doesn't set the category and subcategory when an internal server error occurs", async () => {
    const setFetchResult = () => {
      fetch.mockResponseOnce(JSON.stringify({}), { status: 500 })
    }
    await testUnhappyWorkflow(setFetchResult)
  })

  it("doesn't set the category and subcategory when user is authenticated", async () => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ category: 'foo', subcategory: 'bar' }))
    jest.spyOn(auth, 'isAuthenticated').mockImplementation(() => true)

    fetch.mockResponseOnce(JSON.stringify({ is_active: true }))

    act(() => history.push('/initial-location'))

    const { findByTestId } = render(withAppContext(<IncidentClassification />))

    await findByTestId('loadingIndicator')
    expect(dispatch).not.toHaveBeenCalled()
    expect(history.location.pathname).toEqual('/')
  })
})
