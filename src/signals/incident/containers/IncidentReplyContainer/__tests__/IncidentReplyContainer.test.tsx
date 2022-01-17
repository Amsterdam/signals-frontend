// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import * as reactRouterDom from 'react-router-dom'
import * as actions from 'containers/App/actions'
import { render, waitFor, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'
import { mocked } from 'ts-jest/utils'

import * as constants from '../constants'
import * as API from '../../../../../../internals/testing/api'
import IncidentReplyContainer from '..'

import {
  fetchMock,
  mockRequestHandler,
} from '../../../../../../internals/testing/msw-server'

fetchMock.disableMocks()

const mockedGlobalNotification = mocked(
  actions.showGlobalNotification,
  true
).mockReturnValue({
  type: 'sia/App/SHOW_GLOBAL_NOTIFICATION',
})
jest.mock('containers/App/actions')

const mockedUseParams = mocked(reactRouterDom.useParams, true)
jest.mock('react-router-dom', () => ({
  useParams: jest.fn(),
}))

describe('IncidentReplyContainer', () => {
  describe('active questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        uuid: 'valid-session-uuid',
      }))
    })

    it('renders the incident reply form correctly', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      screen.getByTestId('loadingIndicator')

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Aanvullende informatie' })
        screen.getByRole('heading', { name: 'Uw melding' })
        screen.getByText('Nummer: SIA-1234')
        screen.getByText('Gemeld op: 26 juli 2021, 17:43 uur')
        screen.getByRole('textbox', { name: 'Wat voor kleur heeft de auto?' })
        screen.getByLabelText(/Foto's toevoegen/)
        screen.getByRole('button', { name: 'Verstuur' })
        expect(screen.queryByTestId('loadingIndicator')).not.toBeInTheDocument()
      })
    })

    it('does not submit when form is invalid', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Aanvullende informatie' })
      })

      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        expect(screen.getByTestId('textareaError')).toHaveTextContent(
          'Dit is een verplicht veld'
        )
      })
    })

    it('submit when form is valid', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Aanvullende informatie' })
      })

      act(() => {
        userEvent.type(
          screen.getByRole('textbox', {
            name: 'Wat voor kleur heeft de auto?',
          }),
          'Rood'
        )
      })
      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.SUBMITTED_TITLE })
        screen.getByText(constants.SUBMITTED_CONTENT)
      })
    })

    it('handles file upload', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Aanvullende informatie' })
      })

      act(() => {
        userEvent.type(
          screen.getByRole('textbox', {
            name: 'Wat voor kleur heeft de auto?',
          }),
          'Rood'
        )
      })

      // Upload file to file input
      const fileInput = screen.getByLabelText(/Foto's toevoegen/)
      const file = new File(['hello'], 'hello.png', { type: 'image/png' })
      Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 }) // 1 MB
      userEvent.upload(fileInput, file)

      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.SUBMITTED_TITLE })
        screen.getByText(constants.SUBMITTED_CONTENT)
      })
    })

    it('handles errors during submit', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: 'Aanvullende informatie' })
      })

      act(() => {
        userEvent.type(
          screen.getByRole('textbox', {
            name: 'Wat voor kleur heeft de auto?',
          }),
          'Rood'
        )
      })

      mockRequestHandler({
        status: 500,
        method: 'post',
        url: API.QA_ANSWER,
        body: {
          detail: 'Something went wrong',
        },
      })

      userEvent.click(screen.getByRole('button', { name: 'Verstuur' }))

      await waitFor(() => {
        expect(mockedGlobalNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            title: constants.GENERIC_ERROR_TITLE,
            message: constants.GENERIC_ERROR_CONTENT,
          })
        )
      })
    })
  })

  describe('expired questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        uuid: 'expired',
      }))
    })
    it('should render the correct message', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.INACCESSIBLE_TITLE })
        screen.getByText(constants.INACCESSIBLE_CONTENT)
      })
    })
  })

  describe('previously submitted questionnaire', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        uuid: 'locked',
      }))
    })

    it('should render the correct message', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', {
          name: constants.SUBMITTED_PREVIOUSLY_TITLE,
        })
        screen.getByText(constants.SUBMITTED_PREVIOUSLY_CONTENT)
      })
    })
  })

  describe('questionnaire when incident status was changed', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        uuid: 'invalidated',
      }))
    })

    it('should render the correct message', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', {
          name: constants.INACCESSIBLE_TITLE,
        })
        screen.getByText(constants.INACCESSIBLE_CONTENT)
      })
    })
  })

  describe('invalid uuid', () => {
    beforeAll(() => {
      mockedUseParams.mockImplementation(() => ({
        uuid: 'invalid-uuid',
      }))
    })

    it('should render the correct message', async () => {
      render(withAppContext(<IncidentReplyContainer />))

      await waitFor(() => {
        screen.getByRole('heading', { name: constants.GENERIC_ERROR_TITLE })
        screen.getByText(constants.GENERIC_ERROR_CONTENT)
      })
    })
  })
})
