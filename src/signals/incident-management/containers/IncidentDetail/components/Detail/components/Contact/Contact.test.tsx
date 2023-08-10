import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Contact } from './Contact'
import { withAppContext } from '../../../../../../../../test/utils'
import incidentJSON from '../../../../../../../../utils/__tests__/fixtures/incident.json'
const incidentFixture = incidentJSON as unknown as any

describe('Contact', () => {
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
  //
  // const emailField = container.querySelector('input[name="email"]')
  //  const phoneField = container.querySelector('input[name="phone"]')
  //
  //  expect(emailField).toBeInTheDocument()
  //  expect(phoneField).toBeInTheDocument()
  //
  //  // fill email with user@domain.nl and phone with 061234567
  //  if (!emailField || !phoneField) {
  //    throw new Error('fields not found')
  //  }
  //  userEvent.type(emailField, 'user@domain.nl')
  //
  //  userEvent.type(phoneField, '061234567')
  //
  //  expect(emailField).toHaveValue('user@domain.nl')
  //
  //  expect(phoneField).toHaveValue('061234567')

  it('should show an error when the email field is wrong', () => {})

  it('should show an error when the email field is empty', () => {})
})
