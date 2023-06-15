// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRedux from 'react-redux'

import { showGlobalNotification } from 'containers/App/actions'
import { VARIANT_ERROR, TYPE_LOCAL } from 'containers/Notification/constants'
import { withAppContext } from 'test/utils'

import { OverviewPage } from './OverviewPage'
import * as API from '../../../../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../../internals/testing/msw-server'
import { StandardTextsAdminProvider } from '../../provider'

fetchMock.disableMocks()

const dispatch = jest.fn()

const mockProviderValue = {
  page: 1,
  setPage: () => {},
}

const renderComponent = () =>
  render(
    withAppContext(
      <StandardTextsAdminProvider value={mockProviderValue}>
        <OverviewPage />
      </StandardTextsAdminProvider>
    )
  )

describe('OverviewPage', () => {
  beforeEach(() => {
    jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch)
  })

  it('renders the component with standard texts', async () => {
    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('[FILTER]')).toBeInTheDocument()
      expect(screen.getByText('[SEARCH BAR]')).toBeInTheDocument()

      expect(screen.getByText('Titel #1')).toBeInTheDocument()
      expect(screen.getByText('Titel #5')).toBeInTheDocument()
      expect(screen.queryByText('Titel #15')).not.toBeInTheDocument()
    })
  })

  it('renders a loader when loading', async () => {
    renderComponent()
    const loader = await screen.findByTestId('loading-indicator')

    expect(loader).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
    })
  })

  it('displays an error notification if the fetch fails', async () => {
    mockRequestHandler({
      method: 'get',
      url: API.STANDARD_TEXTS_SEARCH_ENDPOINT,
      status: 500,
      body: 'Something went wrong',
    })

    renderComponent()

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledWith(
        showGlobalNotification({
          title: 'Interne fout op de server. Probeer het nogmaals',
          message: 'De standaardteksten konden niet worden opgehaald',
          variant: VARIANT_ERROR,
          type: TYPE_LOCAL,
        })
      )
    })
  })

  it('should show next page when next button is clicked', async () => {
    renderComponent()

    const nextButton = screen.getByRole('button', { name: 'Volgende pagina' })

    await waitFor(() => {
      expect(screen.getByText('Titel #1')).toBeInTheDocument()
      expect(screen.getByText(/van 2/)).toBeInTheDocument()
    })

    userEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.queryByText('Titel #1')).not.toBeInTheDocument()
      expect(screen.getByText('Titel #15')).toBeInTheDocument()
    })
  })
})
