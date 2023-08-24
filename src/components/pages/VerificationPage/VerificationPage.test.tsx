import { render, screen, waitFor } from '@testing-library/react'
import * as reactRouterDom from 'react-router-dom'

import { VerificationPage } from './VerificationPage'
import * as API from '../../../../internals/testing/api'
import {
  fetchMock,
  mockRequestHandler,
} from '../../../../internals/testing/msw-server'
import { withAppContext } from '../../../test/utils'

fetchMock.disableMocks()
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

jest.mock('shared/services/configuration/configuration')

describe('VerificationPage', () => {
  beforeEach(() => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ token: '123' }))
  })
  it('should render the verification success page', async () => {
    render(withAppContext(<VerificationPage />))

    await waitFor(() => {
      expect(screen.getByText('E-mailadres bevestigd')).toBeInTheDocument()
      expect(
        screen.getByText(
          'Uw e-mailadres voor de melding is nu gewijzigd. U heeft hierover een e-mail gekregen. Heeft u de e-mail niet ontvangen? Controleer dan ook uw spamfolder.'
        )
      ).toBeInTheDocument()
    })
  })

  it('should render the verification failed page', async () => {
    mockRequestHandler({
      url: API.EMAIL_VERIFICATION_ENDPOINT,
      method: 'post',
      status: 400,
      body: 'wrong token',
    })

    render(withAppContext(<VerificationPage />))

    await waitFor(() => {
      expect(screen.getByText('Link ongeldig')).toBeInTheDocument()
      expect(
        screen.getByText(
          'De link om uw e-mailadres te wijzigen is verlopen of ongeldig. Om een nieuwe verificatielink te ontvangen kunt u bellen met telefoonnummer 14 020, maandag tot en met vrijdag van 08.00 tot 18.00.'
        )
      ).toBeInTheDocument()
    })
  })
})
