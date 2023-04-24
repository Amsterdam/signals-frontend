// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import * as reactRouterDom from 'react-router-dom'

import { withContext } from 'components/Summary/Summary.test'
import useFetch from 'hooks/useFetch'
import { useFetchResponse } from 'signals/IncidentMap/components/__test__/utils'
import { subCategories } from 'utils/__tests__/fixtures'
import historyJSON from 'utils/__tests__/fixtures/history.json'

import { CategoryDetail } from './Detail'

jest.mock('hooks/useFetch')

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ categoryId: '145' }),
}))

const mockConfirmedCancel = jest.fn()
jest.mock('../../hooks/useConfirmedCancel', () => ({
  __esModule: true,
  default: jest.fn(() => mockConfirmedCancel),
}))

const pushSpy = jest.fn()
const useHistorySpy = { push: pushSpy } as any
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => useHistorySpy)

const categoryJSON = subCategories.find((sub) => sub?._links['sia:parent'])

const mockCategoryResponse = {
  ...useFetchResponse,
  data: categoryJSON,
}

const mockHistoryResponse = {
  ...useFetchResponse,
  data: historyJSON,
}

const mockLocation = {
  hash: '',
  key: '',
  pathname: '/instellingen/categorie/145',
  search: '',
  state: null,
  href: '/instellingen/categorieen',
  referrer: '/instellingen/categorieen',
}

const mockFetch = (categoryResponse: any, historyRespnse: any) => {
  jest.mocked(useFetch).mockImplementationOnce(() => categoryResponse)
  jest.mocked(useFetch).mockImplementationOnce(() => historyRespnse)
  jest.mocked(useFetch).mockImplementationOnce(() => categoryResponse)
  jest.mocked(useFetch).mockImplementationOnce(() => historyRespnse)
  jest.mocked(useFetch).mockImplementationOnce(() => categoryResponse)
  jest.mocked(useFetch).mockImplementationOnce(() => historyRespnse)
  jest.mocked(useFetch).mockImplementationOnce(() => categoryResponse)
  jest.mocked(useFetch).mockImplementationOnce(() => historyRespnse)
  jest.mocked(useFetch).mockImplementationOnce(() => categoryResponse)
  jest.mocked(useFetch).mockImplementationOnce(() => historyRespnse)
}
const dispatch = jest.fn()
describe('Detail', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(jest.fn(() => true))
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the form values', () => {
    mockFetch(mockCategoryResponse, mockHistoryResponse)
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
      'Afwatering brug'
    )
    expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(
      'Dit is het verhaal van de brug die moest afwateren.'
    )
    expect(screen.getByText('VOR, STW')).toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toHaveValue(5)
    expect(screen.getByRole('combobox')).toHaveValue('0')
    expect(screen.getByRole('textbox', { name: 'Servicebelofte' })).toHaveValue(
      'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.'
    )
    expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Niet actief' })).not.toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Notitie' })).toHaveValue('')
  })

  it('should render a backlink', async () => {
    mockFetch(mockCategoryResponse, mockHistoryResponse)
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    const backLink = await screen.findByTestId('backlink')

    expect(backLink.getAttribute('href')).toEqual('/instellingen/categorieen')
  })

  it('should render the correct page title for an existing category', () => {
    mockFetch(mockCategoryResponse, mockHistoryResponse)
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    const title = screen.getByText('Subcategorie wijzigen')
    expect(title).toBeInTheDocument()
  })

  // TODO: fix test, only works alone

  // it('should call confirm cancel', async () => {
  //   mockFetch(mockCategoryResponse, mockHistoryResponse)

  //   render(
  //     withContext(
  //       <MemoryRouter initialEntries={[mockLocation]}>
  //         <CategoryDetail />
  //       </MemoryRouter>
  //     )
  //   )

  //   await screen.findByTestId('detail-category-form')

  //   const nameField = screen.getByRole('textbox', { name: 'Naam' })

  //   const cancelButton = screen.getByTestId('cancel-btn')

  //   // no changes to data in form fields
  //   userEvent.click(cancelButton)

  //   expect(mockConfirmedCancel).toHaveBeenCalledTimes(1)
  //   expect(mockConfirmedCancel).toHaveBeenCalledWith(true)

  //   // changes made, but data remains the same
  //   userEvent.clear(nameField)
  //   userEvent.type(nameField, categoryJSON?.name as string)

  //   userEvent.click(cancelButton)

  //   // expect(mockConfirmedCancel).toHaveBeenCalledTimes(2)
  //   expect(mockConfirmedCancel).toHaveBeenLastCalledWith(true)

  //   // changes made, data differs from initial API data
  //   userEvent.type(nameField, 'Some other value')

  //   userEvent.click(cancelButton)

  //   // expect(mockConfirmedCancel).toHaveBeenCalledTimes(3)
  //   expect(mockConfirmedCancel).toHaveBeenLastCalledWith(false)
  // })

  it('should call patch on submit', async () => {
    mockFetch(mockCategoryResponse, mockHistoryResponse)
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    const nameInput = screen.getByRole('textbox', { name: 'Naam' })
    const submitButton = screen.getByTestId('submit-btn')

    userEvent.type(nameInput, '-test')

    expect(nameInput).toHaveValue('Afwatering brug-test')

    userEvent.click(submitButton)

    // TODO: assert patch query
  })

  it('should redirect on patch success', () => {
    const mockCategoryResponseSuccess = {
      ...mockCategoryResponse,
      isSuccess: true,
    }

    mockFetch(mockCategoryResponseSuccess, mockHistoryResponse)

    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    const nameInput = screen.getByRole('textbox', { name: 'Naam' })
    const submitButton = screen.getByTestId('submit-btn')

    userEvent.type(nameInput, '-test')

    expect(nameInput).toHaveValue('Afwatering brug-test')

    userEvent.click(submitButton)

    // TODO: assert patch query
  })

  it('should requests history for existing category', async () => {
    mockFetch(mockCategoryResponse, mockHistoryResponse)

    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail />
        </MemoryRouter>
      )
    )

    await screen.findByTestId('detail-category-form')

    // TODO: assert history get query
  })
})
