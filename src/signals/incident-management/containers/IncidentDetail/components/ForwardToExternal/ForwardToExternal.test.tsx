// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Vereniging van Nederlandse Gemeenten
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import fetchMock from 'jest-fetch-mock'

import * as actions from 'containers/App/actions'
import configuration from 'shared/services/configuration/configuration'
import { DOORGEZET_NAAR_EXTERN } from 'signals/incident-management/definitions/statusList'
import { StatusCode } from 'signals/incident-management/definitions/types'
import { withAppContext } from 'test/utils'
import type { Incident } from 'types/api/incident'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'

import attachmentsFixture from '../../../../../../../internals/mocks/fixtures/attachments.json'
import { PATCH_TYPE_STATUS } from '../../constants'
import IncidentDetailContext from '../../context'
import ForwardToExternal, { MAX_MESSAGE_LENGTH } from './ForwardToExternal'

const scrollIntoViewMock = jest.fn()
window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock
jest.spyOn(actions, 'showGlobalNotification')

const EMAIL_URL = `${configuration.INCIDENTS_ENDPOINT}${incidentFixture.id}/email/preview`
const components = {
  title: () =>
    screen.getByRole('heading', {
      name: /doorzetten naar externe partij/i,
    }),
  emailInput: () =>
    screen.getByRole('textbox', { name: /e-mail behandelaar/i }),
  messageInput: () =>
    screen.getByRole('textbox', { name: /toelichting behandelaar/i }),
  formSubmit: () => screen.getByTestId('form-submit-button'),
  formCancel: () => screen.getByRole('button', { name: /annuleer/i }),
  attachment: () =>
    screen.getByRole('img', { name: attachmentsFixture.results[0]._display }),
  emailPreview: () => screen.getByText('Controleer bericht aan behandelaar'),
  emailPreviewSubmitButton: () => screen.getByTestId('submit-btn'),
}

describe('ForwardToExternal', () => {
  it('renders the component', () => {
    render(
      withAppContext(
        <IncidentDetailContext.Provider
          value={{
            update: jest.fn(),
            attachments: attachmentsFixture,
          }}
        >
          <ForwardToExternal onClose={jest.fn()} />
        </IncidentDetailContext.Provider>
      )
    )

    expect(components.title()).toBeInTheDocument()
    expect(components.emailInput()).toBeInTheDocument()
    expect(components.messageInput()).toBeInTheDocument()
    expect(components.attachment()).toBeInTheDocument()
    expect(components.formSubmit()).toBeInTheDocument()
    expect(components.formCancel()).toBeInTheDocument()
    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  describe('form', () => {
    describe('validation', () => {
      it('validates required fields', async () => {
        render(withAppContext(<ForwardToExternal onClose={() => {}} />))

        userEvent.click(components.formSubmit())

        await waitFor(() => {
          const alerts = screen.getAllByRole('alert')

          expect(alerts).toHaveLength(2)
          alerts.forEach((alert) =>
            expect(alert).toHaveTextContent(
              'Dit veld is verplicht voor het doorzetten naar een externe partij.'
            )
          )
        })
      })

      it('validates e-mail address format', async () => {
        render(withAppContext(<ForwardToExternal onClose={() => {}} />))

        userEvent.type(components.emailInput(), 'invalid: not an e-mail')
        userEvent.type(components.messageInput(), 'valid message')
        userEvent.click(components.formSubmit())

        await waitFor(() => {
          expect(screen.queryByRole('alert')).toHaveTextContent(
            'Dit is geen geldig e-mail adres.'
          )
        })
      })

      it('validates message length', async () => {
        render(withAppContext(<ForwardToExternal onClose={() => {}} />))

        userEvent.type(components.emailInput(), 'foo@example.com')
        userEvent.type(
          components.messageInput(),
          'x'.repeat(MAX_MESSAGE_LENGTH + 1)
        )
        userEvent.click(components.formSubmit())

        await waitFor(() => {
          expect(screen.queryByRole('alert')).toHaveTextContent(
            `Je hebt meer dan de maximale ${MAX_MESSAGE_LENGTH} tekens ingevoerd.`
          )
        })
      })
    })

    it('handles cancel', () => {
      const mockClose = jest.fn()
      const { unmount } = render(
        withAppContext(<ForwardToExternal onClose={mockClose} />)
      )

      userEvent.click(components.formCancel())

      expect(mockClose).toHaveBeenCalled()
      unmount()
    })

    describe('email preview', () => {
      const email = 'foo@example.com'
      const message = 'Some message'
      const updateSpy = jest.fn()
      const closeSpy = jest.fn()
      const renderAndSubmitForm = () => {
        render(
          withAppContext(
            <IncidentDetailContext.Provider
              value={{
                update: updateSpy,
                incident: incidentFixture as unknown as Incident,
              }}
            >
              <ForwardToExternal onClose={closeSpy} />
            </IncidentDetailContext.Provider>
          )
        )

        userEvent.type(components.emailInput(), email)
        userEvent.type(components.messageInput(), message)
        act(() => {
          userEvent.click(components.formSubmit())
        })
      }

      it('renders email preview', async () => {
        renderAndSubmitForm()

        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(
            EMAIL_URL,
            expect.objectContaining({
              method: 'POST',
              body: JSON.stringify({
                status: StatusCode.DoorgezetNaarExtern,
                text: message,
                email_override: email,
              }),
            })
          )
          expect(components.emailPreview()).toBeInTheDocument()
        })
      })

      it('shows an error notification when no email preview is available', async () => {
        fetchMock.mockResponse('Error!', { status: 404 })
        renderAndSubmitForm()

        await waitFor(() => {
          expect(actions.showGlobalNotification).toHaveBeenCalledWith(
            expect.objectContaining({
              title:
                'Er is geen email template beschikbaar voor de gegeven statustransitie',
            })
          )
        })
      })

      it('updates status on submit', async () => {
        const htmlString =
          '<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Uw melding SIA-1</title></head><body><p>Geachte melder,</p><p>Op 9 februari 2022 om 13.00 uur hebt u een melding gedaan bij de gemeente. In deze e-mail leest u de stand van zaken van uw melding.</p><p><strong>U liet ons het volgende weten</strong><br />Just some text<br /> Some text on the next line</p><p><strong>Stand van zaken</strong><br />Wij pakken dit z.s.m. op</p><p><strong>Gegevens van uw melding</strong><br />Nummer: SIA-1<br />Gemeld op: 9 februari 2022, 13.00 uur<br />Plaats: Amstel 1, 1011 PN Amsterdam</p><p><strong>Meer weten?</strong><br />Voor vragen over uw melding in Amsterdam kunt u bellen met telefoonnummer 14 020, maandag tot en met vrijdag van 08.00 tot 18.00 uur. Voor Weesp kunt u bellen met 0294 491 391, maandag tot en met vrijdag van 08.30 tot 17.00 uur. Geef dan ook het nummer van uw melding door: SIA-1.</p><p>Met vriendelijke groet,</p><p>Gemeente Amsterdam</p></body></html>'
        const mockResponse = JSON.stringify({
          subject: 'melding 123',
          html: htmlString,
        })
        fetchMock.mockResponseOnce(mockResponse, { status: 200 })
        renderAndSubmitForm()
        await waitFor(() => {
          expect(components.emailPreviewSubmitButton()).toBeInTheDocument()
        })

        userEvent.click(components.emailPreviewSubmitButton())

        expect(updateSpy).toHaveBeenCalledWith({
          type: PATCH_TYPE_STATUS,
          patch: {
            status: {
              state: DOORGEZET_NAAR_EXTERN.key,
              text: message,
              send_email: true,
              email_override: email,
            },
          },
        })
        expect(closeSpy).toHaveBeenCalled()
      })
    })
  })
})
