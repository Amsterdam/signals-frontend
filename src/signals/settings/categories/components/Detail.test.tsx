// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react-hooks'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'

import { withContext } from 'components/Summary/Summary.test'
import { subCategories } from 'utils/__tests__/fixtures'
import historyJSON from 'utils/__tests__/fixtures/history.json'

import type { Props } from './Detail'
import { CategoryDetail } from './Detail'
import * as API from '../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../internals/testing/msw-server'
import * as actions from '../../../../containers/App/actions'

fetchMock.disableMocks()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ categoryId: '145' }),
}))

global.window.confirm = jest.fn()

const pushSpy = jest.fn()
const useHistorySpy = { push: pushSpy } as any
jest.spyOn(reactRouterDom, 'useHistory').mockImplementation(() => useHistorySpy)
jest.spyOn(actions, 'showGlobalNotification')

const categoryJSON = subCategories.find((sub) => sub?._links['sia:parent'])

const mockLocation = {
  hash: '',
  key: '',
  pathname: '/instellingen/categorie/145',
  search: '',
  state: null,
  href: '/instellingen/categorieen',
  referrer: '/instellingen/categorieen',
}

const defaultProps: Props = {
  entityName: 'Categorie',
  isMainCategory: false,
  isPublicAccessibleLabel:
    'Toon meldingen van deze subcategorie op openbare kaarten en op de kaart in het meldformulier.',
}

const dispatch = jest.fn()
describe('Detail', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(jest.fn(() => true))
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

    mockRequestHandler({
      status: 200,
      method: 'get',
      url: API.CATEGORIES_PRIVATE_ENDPOINT,
      body: categoryJSON,
    })

    mockRequestHandler({
      status: 200,
      method: 'get',
      url: API.CATEGORIES_PRIVATE_ENDPOINT_HISTORY,
      body: historyJSON,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the form values', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
        'Afwatering brug'
      )
      expect(screen.getByRole('textbox', { name: 'Omschrijving' })).toHaveValue(
        'Dit is het verhaal van de brug die moest afwateren.'
      )
      expect(screen.getByText('VOR, STW')).toBeInTheDocument()
      expect(screen.getByRole('spinbutton')).toHaveValue(5)
      expect(screen.getByRole('combobox')).toHaveValue('0')
      expect(
        screen.getByRole('textbox', { name: 'Servicebelofte' })
      ).toHaveValue(
        'Wij beoordelen uw melding. Urgente meldingen pakken we zo snel mogelijk op. Overige meldingen handelen we binnen een week af. We houden u op de hoogte via e-mail.'
      )
      expect(screen.getByRole('radio', { name: 'Actief' })).toBeChecked()
      expect(
        screen.getByRole('radio', { name: 'Niet actief' })
      ).not.toBeChecked()
      expect(screen.getByRole('textbox', { name: 'Notitie' })).toHaveValue('')
    })
  })

  it('should render specific main category fields', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} isMainCategory={true} />
        </MemoryRouter>
      )
    )

    await waitFor(() => {
      expect(
        screen.getByText(
          'Toon alle subcategorieën in het filter op de meldingenkaart die openbaar getoond mogen worden'
        )
      ).toBeInTheDocument()
    })
  })

  it('should render a backlink', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    const backLink = await screen.findByTestId('backlink')

    expect(backLink.getAttribute('href')).toEqual('/instellingen/categorieen')
  })

  it('should render the correct page title for an existing category', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    await waitFor(() => {
      expect(screen.getByText('Categorie wijzigen')).toBeInTheDocument()
    })
  })

  it('should call confirm cancel', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    await screen.findByTestId('detail-category-form')

    const nameField = screen.getByRole('textbox', { name: 'Naam' })
    const cancelButton = screen.getByTestId('cancel-btn')

    // no changes to data in form fields
    userEvent.click(cancelButton)

    expect(global.window.confirm).toHaveBeenCalledTimes(0)

    // changes made, data differs from initial API data
    userEvent.type(nameField, 'Some other value')

    userEvent.click(cancelButton)
    expect(global.window.confirm).toHaveBeenCalledTimes(1)
  })

  it('should call patch on submit', async () => {
    mockRequestHandler({
      status: 400,
      method: 'patch',
      url: API.CATEGORIES_PRIVATE_ENDPOINT,
      body: { name: 'Afwatering brug-test' },
    })

    const { rerender } = render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    await waitFor(() => {
      const nameInput = screen.getByRole('textbox', { name: 'Naam' })
      const submitButton = screen.getByTestId('submit-btn')
      userEvent.type(nameInput, '-test')

      expect(nameInput).toHaveValue('Afwatering brug-test')

      userEvent.click(submitButton)
    })

    rerender(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
      'Afwatering brug-test'
    )
  })

  it('should requests history for existing category', async () => {
    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    await screen.findByTestId('detail-category-form')

    expect(
      screen.getByText('Service level agreement wijziging: 4 werkdagen')
    ).toBeInTheDocument()
  })

  it('should show GlobalNotification when submitted w on errorUploadIcon', async () => {
    const mockWrongFile = {
      name: 'testFile.png',
      lastModified: 1683532584202,
      size: 271,
      type: 'image/svg+xml',
      webkitRelativePath: '',
    }

    mockRequestHandler({
      status: 400,
      method: 'patch',
      url: API.CATEGORIES_PRIVATE_ENDPOINT,
      body: { name: 'Afwatering brug-test' },
    })

    render(
      withContext(
        <MemoryRouter initialEntries={[mockLocation]}>
          <CategoryDetail {...defaultProps} />
        </MemoryRouter>
      )
    )

    expect(screen.getByText('Icoon')).toBeInTheDocument()

    const fileInputElement = await screen.findByText(/Icoon toevoegen/i)

    act(() => {
      fireEvent.change(fileInputElement, {
        target: { mockWrongFile },
      })
    })

    //
    // screen.debug()
    // const fileInputElement = await screen.findByText(/Icoon toevoegen/i)
    // act(() => {
    //   fireEvent.change(fileInputElement, {
    //     target: { mockWrongFile },
    //   })
    // })
    //
    // const submitButton = await screen.findByTestId('submit-btn')
    // userEvent.click(submitButton)
    //
    // expect(actions.showGlobalNotification).toHaveBeenCalledWith(
    //   expect.objectContaining({
    //     title: 'De wijzigingen kunnen niet worden opgeslagen.',
    //   })
    // )
  })
})
