import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reactRouterDom from 'react-router-dom'

import IncidentDetailContext from 'signals/incident-management/containers/IncidentDetail/context'

import { Contact } from './Contact'
import { fetchMock } from '../../../../../../../../../internals/testing/msw-server'
import { withAppContext } from '../../../../../../../../test/utils'
import incidentJSON from '../../../../../../../../utils/__tests__/fixtures/incident.json'
const incidentFixture = incidentJSON as unknown as any

fetchMock.disableMocks()
jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
}))

describe('Contact', () => {
  beforeAll(() => {
    jest
      .spyOn(reactRouterDom, 'useParams')
      .mockImplementation(() => ({ id: '7740' }))
  })

  it('should render the component', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await act(async () => {
      render(withAppContext(<Contact showPhone incident={incidentFixture} />))
    })

    expect(screen.getByText('Telefoon melder')).toBeInTheDocument()

    expect(screen.getByText('E-mail melder')).toBeInTheDocument()

    expect(screen.getByText('14020')).toBeInTheDocument()

    expect(screen.getByText('me@email.com')).toBeInTheDocument()

    expect(screen.getByTestId('edit-contact-button')).toBeInTheDocument()
  })

  it('should open the edit form when clicking the edit button', async () => {
    await act(async () => {
      render(withAppContext(<Contact showPhone incident={incidentFixture} />))
    })

    expect(screen.getByTestId('edit-contact-button')).toBeInTheDocument()

    userEvent.click(screen.getByTestId('edit-contact-button'))

    expect(screen.getByTestId('contact-form-submit-button')).toBeInTheDocument()

    expect(screen.getByTestId('contact-form-cancel-button')).toBeInTheDocument()
  })

  it('should open edit form and show form errors', async () => {
    await act(async () => {
      render(withAppContext(<Contact showPhone incident={incidentFixture} />))
    })

    userEvent.click(screen.getByTestId('edit-contact-button'))

    const inputs = screen.getAllByRole('textbox')

    inputs.forEach((input) => {
      userEvent.clear(input)
    })

    await act(async () => {
      userEvent.click(screen.getByTestId('contact-form-submit-button'))
    })

    screen.getByText(
      'E-mailadres mag niet leeg zijn. Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl.'
    )

    userEvent.type(screen.getByPlaceholderText('E-mail melder'), 'test')

    await act(async () => {
      userEvent.click(screen.getByTestId('contact-form-submit-button'))
    })

    screen.getByText(
      'Vul een geldig e-mailadres in, met een @ en een domeinnaam. Bijvoorbeeld: naam@domein.nl.'
    )

    userEvent.type(screen.getByPlaceholderText('Telefoon melder'), 'test')

    await act(async () => {
      userEvent.click(screen.getByTestId('contact-form-submit-button'))
    })

    screen.getByText(
      'Vul een geldig telefoonnummer in. Alleen cijfers, spaties, haakjes, + en - zijn toegestaan.'
    )
  })

  it('should open edit form, change email and submit', async () => {
    const getHistoryMock = jest.fn()
    const getIncidentMock = jest.fn()
    await act(async () => {
      render(
        withAppContext(
          <IncidentDetailContext.Provider
            value={{
              update: jest.fn(),
              getHistory: getHistoryMock,
              getIncident: getIncidentMock,
            }}
          >
            <Contact showPhone incident={incidentFixture} />
          </IncidentDetailContext.Provider>
        )
      )
    })

    act(() => {
      userEvent.click(screen.getByTestId('edit-contact-button'))
    })

    userEvent.type(screen.getByPlaceholderText('E-mail melder'), 'm')

    userEvent.click(screen.getByTestId('contact-form-submit-button'))

    await waitFor(() => {
      expect(
        screen.queryByTestId('contact-form-submit-button')
      ).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(getHistoryMock).toHaveBeenCalled()
      expect(getIncidentMock).toHaveBeenCalled()
    })
  })

  it('should show verificatie e-mail verstuurd message', async () => {
    await act(async () => {
      render(withAppContext(<Contact showPhone incident={incidentFixture} />))
    })

    await waitFor(() => {
      expect(screen.queryByText(/verificatie verzonden/)).toBeInTheDocument()
    })
  })
})
