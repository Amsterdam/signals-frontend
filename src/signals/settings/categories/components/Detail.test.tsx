// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { withContext } from 'components/Summary/Summary.test'
import * as useConfirm from 'hooks/useConfirm'
import { subCategories } from 'utils/__tests__/fixtures'
import historyJSON from 'utils/__tests__/fixtures/history.json'

import { CategoryDetail } from './Detail'
import type { Props } from './Detail'
import * as API from '../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ categoryId: '145' }),
}))

const isConfirmedMock = jest.fn()
const origUseConfirm = useConfirm.useConfirm

const navigateSpy = jest.fn()
jest.spyOn(reactRouterDom, 'useNavigate').mockImplementation(() => navigateSpy)
jest.spyOn(useConfirm, 'useConfirm').mockImplementation(() => {
  const orig = origUseConfirm()
  return {
    ...orig,
    isConfirmed: isConfirmedMock,
  }
})
const categoryJSON = subCategories?.find((sub) => sub?._links['sia:parent'])

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
    jest.spyOn(useConfirm, 'useConfirm').mockImplementation(() => {
      const orig = origUseConfirm()
      return {
        ...orig,
        isConfirmed: isConfirmedMock,
      }
    })

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
    render(withContext(<CategoryDetail {...defaultProps} />))

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
      withContext(<CategoryDetail {...defaultProps} isMainCategory={true} />)
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
    render(withContext(<CategoryDetail {...defaultProps} />))

    const backLink = await screen.findByTestId('backlink')

    expect(backLink.getAttribute('href')).toEqual('/subcategorieen')
  })

  it('should render the correct page title for an existing category', async () => {
    render(withContext(<CategoryDetail {...defaultProps} />))

    await waitFor(() => {
      expect(screen.getByText('Categorie wijzigen')).toBeInTheDocument()
    })
  })

  it('should call confirm cancel', async () => {
    render(withContext(<CategoryDetail {...defaultProps} />))

    await screen.findByTestId('detail-category-form')

    const nameField = screen.getByRole('textbox', { name: 'Naam' })
    const cancelButton = screen.getByTestId('cancel-btn')

    // no changes to data in form fields
    userEvent.click(cancelButton)

    expect(isConfirmedMock).toHaveBeenCalledTimes(0)

    // changes made, data differs from initial API data
    userEvent.type(nameField, 'Some other value')

    userEvent.click(cancelButton)
    expect(isConfirmedMock).toHaveBeenCalledTimes(1)
  })

  it('should call patch on submit', async () => {
    mockRequestHandler({
      status: 400,
      method: 'patch',
      url: API.CATEGORIES_PRIVATE_ENDPOINT,
      body: { name: 'Afwatering brug-test' },
    })

    const { rerender } = render(
      withContext(<CategoryDetail {...defaultProps} />)
    )

    await waitFor(() => {
      const nameInput = screen.getByRole('textbox', { name: 'Naam' })
      const submitButton = screen.getByTestId('submit-btn')
      userEvent.type(nameInput, '-test')

      expect(nameInput).toHaveValue('Afwatering brug-test')

      userEvent.click(submitButton)
    })

    rerender(withContext(<CategoryDetail {...defaultProps} />))

    expect(screen.getByRole('textbox', { name: 'Naam' })).toHaveValue(
      'Afwatering brug-test'
    )
  })

  it('should requests history for existing category', async () => {
    render(withContext(<CategoryDetail {...defaultProps} />))

    await screen.findByTestId('detail-category-form')

    expect(
      screen.getByText('Service level agreement wijziging: 4 werkdagen')
    ).toBeInTheDocument()
  })
})
