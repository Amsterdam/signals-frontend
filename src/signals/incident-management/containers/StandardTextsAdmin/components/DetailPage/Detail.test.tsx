// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { getByRole, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'
import * as reactRouterDom from 'react-router-dom'

import { withAppContext } from 'test/utils'

import { Detail } from './Detail'
import type { StandardTextDetailData } from './types'
import * as API from '../../../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
  rest,
  server,
} from '../../../../../../../internals/testing/msw-server'
import { mockSubcategory } from '../../_test_/mock-subcategories'

fetchMock.disableMocks()
const mockNavigate = jest.fn()
const dispatch = jest.fn()

const id = 4

jest.mock('models/categories/selectors', () => {
  const structuredCategorie = require('utils/__tests__/fixtures/categories_structured.json')
  return {
    __esModule: true,
    ...jest.requireActual('models/categories/selectors'),
    makeSelectStructuredCategories: () => structuredCategorie,
    makeSelectSubCategories: () => mockSubcategory,
  }
})

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

describe('Detail', () => {
  let success: boolean
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)

    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ id: `${id}` }))

    success = false
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render the Detail page', async () => {
    render(withAppContext(<Detail />))

    await waitFor(() => {
      expect(screen.getByText('Standaardtekst wijzigen')).toBeInTheDocument()
      expect(screen.getByText('Terug naar overzicht')).toBeInTheDocument()
      expect(screen.getByText('Mooie omschrijving')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Mooie titel')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Actief' })).toBeChecked()
      expect(
        screen.getByText('Parkeeroverlast, Overige overlast door personen')
      ).toBeInTheDocument()
      expect(screen.queryByText('Afgehandeld')).not.toBeNull()
      expect(screen.queryByDisplayValue('o')).not.toBeNull()
      expect(
        screen.getByRole('button', { name: 'Annuleer' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Opslaan' })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Verwijderen' })
      ).toBeInTheDocument()
    })
  })

  it('renders a loader when loading', async () => {
    render(withAppContext(<Detail />))

    await waitFor(async () => {
      const loader = await screen.findByTestId('loading-indicator')
      expect(loader).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  it('navigates to the previous page when there is a change and the button Opslaan is clicked', async () => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => mockNavigate)

    render(withAppContext(<Detail />))

    await waitFor(() => {
      expect(screen.getByDisplayValue('Mooie titel')).toBeInTheDocument()
    })

    const checkbox = screen.getByRole('checkbox', { name: 'Actief' })

    expect(checkbox).toBeChecked()

    userEvent.click(checkbox)

    expect(checkbox).not.toBeChecked()

    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(async () => {
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })
    await waitFor(async () => {
      expect(mockNavigate).toBeCalledTimes(1)
    })
  })

  it('navigates to the previous page when there is no change and the button Opslaan is clicked', async () => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => mockNavigate)
    render(withAppContext(<Detail />))

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
      expect(mockNavigate).toBeCalledWith(-1)
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  it('deletes the standard text when the button Verwijderen -> Bevestig is pressed', async () => {
    server.use(
      rest.delete(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) => {
        success = true
        return res(ctx.status(202))
      })
    )

    render(withAppContext(<Detail />))

    userEvent.click(screen.getByRole('button', { name: 'Verwijderen' }))
    userEvent.click(screen.getByRole('button', { name: 'Bevestig' }))

    await waitFor(() => expect(success).toEqual(true))
  })

  it("doesn't delete the standard text when the button Verwijderen-> Annuleer is pressed", async () => {
    server.use(
      rest.delete(API.STANDARD_TEXTS_DETAIL_ENDPOINT, (_req, res, ctx) => {
        success = true
        return res(ctx.status(202))
      })
    )

    render(withAppContext(<Detail />))

    userEvent.click(screen.getByRole('button', { name: 'Verwijderen' }))
    userEvent.click(
      getByRole(screen.getByTestId('modal-dialog'), 'button', {
        name: 'Annuleer',
      })
    )

    await waitFor(() => expect(success).toEqual(false))
  })

  it('navigates to previous page when Annuleren is pressed', () => {
    jest
      .spyOn(reactRouterDom, 'useNavigate')
      .mockImplementation(() => mockNavigate)
    render(withAppContext(<Detail />))

    userEvent.click(screen.getByRole('button', { name: 'Annuleer' }))

    expect(mockNavigate).toBeCalledWith(-1)
  })

  it('should change the state', () => {
    render(withAppContext(<Detail />))

    expect(
      screen.getByRole('radio', { name: 'In afwachting van behandeling' })
    ).not.toBeChecked()

    userEvent.click(
      screen.getByRole('radio', { name: 'In afwachting van behandeling' })
    )

    expect(
      screen.getByRole('radio', { name: 'In afwachting van behandeling' })
    ).toBeChecked()
  })

  it('should render a create page', async () => {
    jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}))

    render(withAppContext(<Detail />))

    const titleInput = screen.getByPlaceholderText('Titel')
    const textArea = screen.getByPlaceholderText('Tekst')

    expect(titleInput).toHaveValue('')
    expect(textArea).toHaveValue('')
    expect(
      screen.queryByRole('button', { name: 'Verwijderen' })
    ).not.toBeInTheDocument()

    userEvent.type(titleInput, 'Mooie titel')
    userEvent.type(textArea, 'Mooie tekst')

    expect(titleInput).toHaveValue('Mooie titel')
    expect(textArea).toHaveValue('Mooie tekst')

    const selectCategoryButton = screen.getByText('Selecteer subcategorie(ën)')

    userEvent.click(selectCategoryButton)

    expect(
      screen.getByText('Standaardtekst toewijzen aan categorie(ën)')
    ).toBeInTheDocument()

    const categoryCheckbox = screen.getByRole('checkbox', {
      name: 'Boom - boomstob',
    })

    userEvent.click(categoryCheckbox)

    expect(categoryCheckbox).toBeChecked()

    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

    expect(screen.getByText('Standaardtekst toevoegen')).toBeInTheDocument()

    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(() => {
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    })
  })

  // {"payload": {"title": "Interne fout op de server. Probeer het nogmaals", "type": "global", "variant": "error"}, "type": "sia/App/SHOW_GLOBAL_NOTIFICATION"}

  describe('Error handling', () => {
    it('displays an error notification if the fetch fails', async () => {
      mockRequestHandler({
        method: 'get',
        url: `${API.STANDARD_TEXTS_DETAIL_ENDPOINT}`,
        status: 500,
        body: 'Something went wrong',
      })

      render(withAppContext(<Detail />))

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith({
          payload: {
            title: 'Interne fout op de server. Probeer het nogmaals',
            type: 'global',
            variant: 'error',
          },
          type: 'sia/App/SHOW_GLOBAL_NOTIFICATION',
        })
      })
    })

    it('displays error notifications if there is no category, title and/or description present', async () => {
      const mockData: StandardTextDetailData = {
        id: 5,
        active: true,
        categories: [],
        created_at: '24-06-2023',
        state: 'o',
        text: '',
        title: '',
        updated_at: '25-06-2023',
      }

      mockRequestHandler({
        status: 200,
        method: 'get',
        url: `${API.STANDARD_TEXTS_DETAIL_ENDPOINT}`,
        body: mockData,
      })

      render(withAppContext(<Detail />))

      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

      await waitFor(() => {
        expect(
          screen.getByText('De standaardtekst kan niet worden opgeslagen')
        ).toBeInTheDocument()
        expect(
          screen.getByText('Vul de subcategorie(ën) in')
        ).toBeInTheDocument()
        expect(screen.getByText('Vul een titel in')).toBeInTheDocument()
        expect(screen.getByText('Vul een omschrijving in')).toBeInTheDocument()
      })
    })

    it('should add a new standard text and navigate back but invalidate', async () => {
      jest
        .spyOn(reactRouterDom, 'useNavigate')
        .mockImplementation(() => mockNavigate)
      jest.spyOn(reactRouterDom, 'useParams').mockImplementation(() => ({}))

      render(withAppContext(<Detail />))

      const titleInput = screen.getByPlaceholderText('Titel')
      expect(titleInput).toBeInTheDocument()

      const textArea = screen.getByPlaceholderText('Tekst')
      expect(textArea).toBeInTheDocument()

      userEvent.type(titleInput, 'Nieuwe standaardtekst titel')

      userEvent.type(textArea, 'Nieuwe standaardtekst')

      await waitFor(() => {
        userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
        expect(mockNavigate).toBeCalledWith(-1)
      })
    })
  })

  describe('Subcategories', () => {
    it('should render the subcategories', async () => {
      render(withAppContext(<Detail />))

      userEvent.click(screen.getByText('Selecteer subcategorie(ën)'))

      expect(
        screen.getByText('Standaardtekst toewijzen aan categorie(ën)')
      ).toBeInTheDocument()
    })
  })
})
