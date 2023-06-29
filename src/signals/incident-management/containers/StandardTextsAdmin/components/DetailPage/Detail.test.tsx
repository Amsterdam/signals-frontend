// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { withAppContext } from 'test/utils'

import { Detail } from './Detail'
import type { StandardTextDetailData } from './types'
import * as API from '../../../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../../internals/testing/msw-server'
import { TYPE_LOCAL, VARIANT_ERROR } from 'containers/Notification/constants'
import { mockSubcategory } from '../../_test_/mock-subcategories'

fetchMock.disableMocks()
const mockNavigate = jest.fn()
const dispatch = jest.fn()

const id = 4
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id }),
  useNavigate: () => mockNavigate,
}))

describe('Detail', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useSelector').mockReturnValue(mockSubcategory)
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the Detail page', async () => {
    render(withAppContext(<Detail />))

    await waitFor(() => {
      expect(screen.getByText('Standaardtekst wijzigen')).toBeInTheDocument()
      expect(screen.getByText('Terug naar overzicht')).toBeInTheDocument()
      expect(screen.getByText('Mooie omschrijving')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Mooie titel')).toBeInTheDocument()
      expect(screen.getByRole('checkbox', { name: 'Actief' })).toBeChecked()
      expect(screen.getByText('Overlast, Afval')).toBeInTheDocument()
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
    const loader = await screen.findByTestId('loading-indicator')

    expect(loader).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  it('navigates to the previous page when there is a change and the button Opslaan is clicked', async () => {
    render(withAppContext(<Detail />))

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
      expect(mockNavigate).not.toBeCalled()

      userEvent.click(screen.getByRole('checkbox', { name: 'Actief' }))
      userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))
    })
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('..')
    })
  })

  it('deletes the standard text when the button Verwijderen is pressed', async () => {
    render(withAppContext(<Detail />))

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Verwijderen' }))
    })
    await waitFor(() => {
      expect(mockNavigate).toBeCalledWith('..')
    })
  })

  it('navigates to previous page when Annuleren is pressed', async () => {
    render(withAppContext(<Detail />))

    await waitFor(() => {
      userEvent.click(screen.getByRole('button', { name: 'Annuleer' }))
      expect(mockNavigate).toBeCalledWith('..')
    })
  })

  describe('Error handling', () => {
    it('displays an error notification if the fetch fails', async () => {
      mockRequestHandler({
        method: 'get',
        url: `${API.STANDARD_TEXTS_DETAILS_ENDPOINT}`,
        status: 500,
        body: 'Something went wrong',
      })

      render(withAppContext(<Detail />))

      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledWith(
          showGlobalNotification({
            title: 'Interne fout op de server. Probeer het nogmaals',
            message: 'De standaardtekst kon niet worden opgehaald',
            variant: VARIANT_ERROR,
            type: TYPE_LOCAL,
          })
        )
      })
    })

    it('displays error notifications if there is no category, title and/or description present', async () => {
      const mockErrorData: StandardTextDetailData = {
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
        url: `${API.STANDARD_TEXTS_DETAILS_ENDPOINT}`,
        body: mockErrorData,
      })
      render(withAppContext(<Detail />))

      await waitFor(() => {
        userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

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
  })
})
