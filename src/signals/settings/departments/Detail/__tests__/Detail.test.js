// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import { act, render, fireEvent } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import useFetch from 'hooks/useFetch'
import CONFIGURATION from 'shared/services/configuration/configuration'
import routes, { BASE_URL } from 'signals/settings/routes'
import { withAppContext } from 'test/utils'
import categories from 'utils/__tests__/fixtures/categories_structured.json'
import departmentJson from 'utils/__tests__/fixtures/department.json'

import { DepartmentDetailContainer } from '..'

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('hooks/useFetch')

const navigateMock = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateMock)

const location = {}
jest.spyOn(reactRouterDom, 'useLocation').mockImplementation(() => ({
  location,
}))

const departmentId = departmentJson.id
jest
  .spyOn(reactRouterDom, 'useParams')
  .mockImplementation(() => ({ departmentId }))

const get = jest.fn()
const patch = jest.fn()
const post = jest.fn()

const useFetchResponse = {
  get,
  patch,
  post,
  data: undefined,
  isLoading: false,
  error: false,
  isSuccess: false,
}

const subCategories = Object.entries(categories).flatMap(([, { sub }]) => sub)

const findByMain = (parentKey) =>
  subCategories.filter((category) => category.parentKey === parentKey)

describe('signals/settings/departments/Detail', () => {
  beforeEach(() => {
    useFetch.mockImplementation(() => useFetchResponse)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render a backlink', async () => {
    const { container, findByTestId } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(container.querySelector('a').getAttribute('href')).toEqual(
      `${BASE_URL}/${routes.departments}`
    )
  })

  it('should render the correct title', async () => {
    const { getByText, rerender, findByTestId, unmount } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(getByText('Afdeling wijzigen')).toBeInTheDocument()

    jest.spyOn(reactRouterDom, 'useParams').mockImplementationOnce(() => ({
      departmentId: undefined,
    }))

    unmount()

    rerender(withAppContext(<DepartmentDetailContainer />))

    await findByTestId('settings-page-header')

    expect(getByText('Afdeling toevoegen')).toBeInTheDocument()
  })

  it('should render a loading indicator', async () => {
    const { queryByTestId, rerender, findByTestId, unmount } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(queryByTestId('loading-indicator')).not.toBeInTheDocument()

    useFetch.mockImplementationOnce(() => ({
      ...useFetchResponse,
      isLoading: true,
    }))

    unmount()

    rerender(withAppContext(<DepartmentDetailContainer />))

    await findByTestId('settings-page-header')

    expect(queryByTestId('loading-indicator')).toBeInTheDocument()
  })

  it('should render the department name', async () => {
    const { queryByText, getByText, rerender, findByTestId, unmount } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(queryByText(departmentJson.name)).not.toBeInTheDocument()

    useFetch.mockImplementationOnce(() => ({
      ...useFetchResponse,
      data: departmentJson,
    }))

    unmount()

    rerender(withAppContext(<DepartmentDetailContainer />))

    await findByTestId('department-detail')

    expect(getByText(departmentJson.name)).toBeInTheDocument()
  })

  it('should render category lists', async () => {
    const { queryByTestId, rerender, findByTestId, unmount } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(queryByTestId('category-lists')).not.toBeInTheDocument()

    useFetch.mockImplementation(() => ({
      ...useFetchResponse,
      data: departmentJson,
    }))

    unmount()

    rerender(withAppContext(<DepartmentDetailContainer />))

    await findByTestId('department-detail')

    expect(queryByTestId('category-lists')).not.toBeInTheDocument()

    unmount()

    rerender(
      withAppContext(
        <DepartmentDetailContainer
          categories={categories}
          subCategories={subCategories}
          findByMain={(parentKey) =>
            subCategories.filter((category) => category.parentKey === parentKey)
          }
        />
      )
    )

    const categoryLists = await findByTestId('category-lists')

    expect(categoryLists).toBeInTheDocument()
  })

  it('should fetch on mount', async () => {
    expect(get).not.toHaveBeenCalled()

    const { findByTestId } = render(
      withAppContext(<DepartmentDetailContainer />)
    )

    await findByTestId('settings-page-header')

    expect(get).toHaveBeenCalledWith(
      `${CONFIGURATION.DEPARTMENTS_ENDPOINT}${departmentId}`
    )
  })

  it('should patch on submit', async () => {
    useFetch.mockImplementationOnce(() => ({
      ...useFetchResponse,
      data: departmentJson,
    }))

    const { container, findByTestId } = render(
      withAppContext(
        <DepartmentDetailContainer
          categories={categories}
          subCategories={subCategories}
          findByMain={findByMain}
        />
      )
    )

    expect(patch).not.toHaveBeenCalled()

    await findByTestId('department-detail')

    act(() => {
      fireEvent.click(container.querySelector('[type="submit"]'))
    })

    expect(patch).toHaveBeenCalled()
  })
})
