// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'

import { withAppContext } from 'test/utils'
import incidentFixture from 'utils/__tests__/fixtures/incident.json'
import {
  changeStatusOptionList,
  GEMELD,
  INGEPLAND,
  AFGEHANDELD,
  GEANNULEERD,
  REACTIE_GEVRAAGD,
  StatusCode,
  HEROPEND,
  AFWACHTING,
} from 'signals/incident-management/definitions/statusList'

import userEvent from '@testing-library/user-event'
import { PATCH_TYPE_STATUS } from '../../../constants'
import IncidentDetailContext from '../../../context'
import StatusForm from '..'
import {
  MELDING_CHECKBOX_DESCRIPTION,
  DEELMELDING_EXPLANATION,
  DEELMELDINGEN_STILL_OPEN_HEADING,
  DEELMELDINGEN_STILL_OPEN_CONTENT,
  DEFAULT_TEXT_LABEL,
  DEFAULT_TEXT_MAX_LENGTH,
} from '../constants'

const defaultTexts = [
  {
    state: 'ingepland',
    templates: [
      { title: 'Ingepland', text: 'Over 1 dag' },
      { title: 'Ingepland', text: 'Over 2 dagen' },
      { title: '', text: '' },
    ],
  },
  {
    state: 'o',
    templates: [
      { title: 'Niet opgelost', text: 'Geen probleem gevonden' },
      { title: 'Niet opgelost', text: 'Niet voor regio Amsterdam' },
      { title: 'Opgelost', text: 'Lamp vervangen' },
      { title: 'Opgelost', text: 'Lantaarnpaal vervangen' },
    ],
  },
]

const close = jest.fn()
const update = jest.fn()

const renderWithContext = (incident = incidentFixture, childIncidents) =>
  withAppContext(
    <IncidentDetailContext.Provider value={{ incident, update, close }}>
      <StatusForm defaultTexts={defaultTexts} childIncidents={childIncidents} />
    </IncidentDetailContext.Provider>
  )

const statusSendsEmailWhenSet = AFGEHANDELD

const statusDoesNotSendEmailWhenSet = changeStatusOptionList.filter(
  ({ email_sent_when_set }) => !email_sent_when_set
)[0]

describe('signals/incident-management/containers/IncidentDetail/components/StatusForm', () => {
  beforeEach(() => {
    close.mockReset()
    update.mockReset()
  })

  it('renders correctly', () => {
    render(renderWithContext())

    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Status opslaan' })
    ).toBeInTheDocument()
    expect(screen.getByTestId('statusFormCancelButton')).toBeInTheDocument()

    Object.values(changeStatusOptionList).forEach(({ value }) => {
      expect(screen.getByLabelText(value)).toBeInTheDocument()
    })

    expect(screen.getByTestId('sendEmailCheckbox')).toBeInTheDocument()
    expect(screen.getByText(MELDING_CHECKBOX_DESCRIPTION)).toBeInTheDocument()
  })

  it('renders a disabled checkbox', () => {
    // render component with incident status that will disable the checkbox
    render(
      renderWithContext({
        ...incidentFixture,
        status: { state: statusSendsEmailWhenSet.key },
      })
    )

    // verify that checkbox is checked and disabled
    const checkbox = screen.getByTestId('sendEmailCheckbox')
    expect(checkbox.checked).toEqual(true)
    expect(checkbox.disabled).toEqual(true)

    // verify that the label '(niet verplicht)' is not in the document
    expect(screen.queryByText('(niet verplicht)')).not.toBeInTheDocument()

    // select a status that will not disable the checkbox
    userEvent.click(screen.getByRole('radio', { name: GEMELD.value }))

    // verify that checkbox is NOT checked and NOT disabled
    expect(checkbox.checked).toEqual(false)
    expect(checkbox.disabled).toEqual(false)

    // verify that the label '(niet verplicht)' is in the document
    expect(screen.queryByText('(niet verplicht)')).toBeInTheDocument()
  })

  it('renders a disabled checkbox when changing from verzoek tot heropenen to afgehandeld', () => {
    // render status verzoek tot heropenen
    render(
      renderWithContext({
        ...incidentFixture,
        status: {
          ...incidentFixture.status,
          state: StatusCode.VerzoekTotHeropenen,
        },
      })
    )

    userEvent.click(screen.getByText('Heropend'))

    const checkbox = screen.getByTestId('sendEmailCheckbox')

    expect(checkbox.checked).toEqual(true)
    expect(checkbox.disabled).toEqual(true)

    userEvent.click(screen.getByText('Afgehandeld'))

    expect(checkbox.checked).toEqual(false)
    expect(checkbox.disabled).toEqual(false)
  })

  it('requires a text value when the checkbox is selected', async () => {
    // render component with incident status that will disable the checkbox
    render(
      renderWithContext({
        ...incidentFixture,
        status: { state: statusSendsEmailWhenSet.key },
      })
    )

    // verify that checkbox is checked and disabled
    const checkbox = screen.getByTestId('sendEmailCheckbox')
    expect(checkbox.checked).toEqual(true)
    expect(checkbox.disabled).toEqual(true)

    // submit the form
    userEvent.click(screen.getByRole('button', { name: 'Status opslaan' }))

    await screen.findByTestId('statusForm')

    // verify that an error message is shown
    expect(screen.queryByText('Dit veld is verplicht')).toBeInTheDocument()

    // verify that 'update' and 'close' have NOT been called
    expect(update).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()

    // type text in textarea
    const textarea = screen.getByRole('textbox')
    const value = 'Foo bar baz'
    userEvent.type(textarea, value)

    // verify that an error message is NOT shown
    expect(screen.queryByText('Dit veld is verplicht')).not.toBeInTheDocument()

    // submit the form
    userEvent.click(screen.getByRole('button', { name: 'Status opslaan' }))

    await screen.findByTestId('statusForm')

    // verify that 'update' and 'close' have been called
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: PATCH_TYPE_STATUS,
        patch: {
          status: expect.objectContaining({ text: value }),
        },
      })
    )
    expect(close).toHaveBeenCalled()
  })

  it('toggles the requirement for the text field', () => {
    // render component
    render(
      renderWithContext({
        ...incidentFixture,
        status: { state: statusDoesNotSendEmailWhenSet.key },
      })
    )

    const checkbox = screen.getByTestId('sendEmailCheckbox')

    expect(checkbox.checked).toEqual(false)

    // verify that the label '(niet verplicht)' is in the document
    expect(screen.getByText('(niet verplicht)')).toBeInTheDocument()

    // check the box
    userEvent.click(checkbox)

    expect(checkbox.checked).toEqual(true)

    // verify that the label '(niet verplicht)' is not in the document
    expect(screen.queryByText('(niet verplicht)')).not.toBeInTheDocument()

    // toggle the box
    userEvent.click(checkbox)

    // verify that the label '(niet verplicht)' is in the document
    expect(screen.getByText('(niet verplicht)')).toBeInTheDocument()
  })

  it('clears the text field when a default text is selected', () => {
    // render component with incident status that will render default texts
    const texts = defaultTexts[0]
    render(
      renderWithContext({ ...incidentFixture, status: { state: texts.state } })
    )

    // verify that there are default texts visible
    expect(screen.getByTestId('defaultTextsTitle')).toBeInTheDocument()

    // verify that the text field is empty
    const textarea = screen.getByRole('textbox')
    expect(textarea.value).toEqual('')

    // click a default text link
    const link = screen.getAllByTestId('defaultTextsItemButton')[0]
    userEvent.click(link)

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(texts.templates[0].text)

    // select another status
    userEvent.click(screen.getByRole('radio', { name: GEMELD.value }))

    // verify that the text field is empty again
    expect(textarea.value).toEqual('')
  })

  it('does not clear the text field when text has been entered manually', () => {
    // render component
    render(renderWithContext())

    // verify that the text field is empty
    const textarea = screen.getByRole('textbox')
    expect(textarea.value).toEqual('')

    // type in textarea
    const value = 'Foo bar baz'
    userEvent.type(textarea, value)

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(value)

    // select another status
    userEvent.click(screen.getByRole('radio', { name: AFWACHTING.value }))

    // verify that the text field is NOT empty
    expect(textarea.value).toEqual(value)
  })

  it('shows an error when typing too many characters in the text field', async () => {
    render(renderWithContext())

    const textarea = screen.getByRole('textbox')

    userEvent.type(textarea, 'A'.repeat(DEFAULT_TEXT_MAX_LENGTH + 1))

    userEvent.click(screen.getByRole('button', { name: 'Opslaan' }))

    expect(screen.getByRole('alert').textContent).toBe(
      `Je hebt meer dan de maximale ${DEFAULT_TEXT_MAX_LENGTH} tekens ingevoerd.`
    )
  })

  it('shows an error when the text field contains specific characters', async () => {
    // render component
    render(renderWithContext())

    // type in textarea with special characters '{{' and '}}'
    const textarea = screen.getByRole('textbox')
    const value = 'Foo {{bar}} baz'
    userEvent.type(textarea, value)

    // verify that an error message is NOT shown
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    // submit the form
    userEvent.click(screen.getByRole('button', { name: 'Status opslaan' }))

    await screen.findByTestId('statusForm')

    // verify that an error message is shown
    expect(screen.getByRole('alert')).toBeInTheDocument()

    // verify that 'update' and 'close' have NOT been called
    expect(update).not.toHaveBeenCalled()
    expect(close).not.toHaveBeenCalled()

    // clear textarea
    const clearText = '{selectall}{backspace}'
    userEvent.type(textarea, clearText)

    // type in textarea
    const validValue = 'Foo bar baz'
    userEvent.type(textarea, validValue)

    // submit the form
    userEvent.click(screen.getByRole('button', { name: 'Status opslaan' }))

    await screen.findByTestId('statusForm')

    // verify that 'update' and 'close' have been called
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        type: PATCH_TYPE_STATUS,
        patch: {
          status: expect.objectContaining({ text: validValue }),
        },
      })
    )
    expect(close).toHaveBeenCalled()
  })

  it('clears the error message when another status is selected', async () => {
    render(renderWithContext())

    // verify that an error message is NOT shown
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: AFGEHANDELD.value }))

    // submit the form
    userEvent.click(screen.getByRole('button', { name: 'Status opslaan' }))

    await screen.findByTestId('statusForm')

    // verify that an error message is shown
    expect(screen.queryByText('Dit veld is verplicht')).toBeInTheDocument()

    // select another status
    const otherStatus = screen.getByRole('radio', {
      name: REACTIE_GEVRAAGD.value,
    })
    userEvent.click(otherStatus)

    // verify that an error message is NOT shown
    expect(screen.queryByText('Dit veld is verplicht')).not.toBeInTheDocument()
  })

  it('shows a warning that is specific to certain statuses', async () => {
    render(renderWithContext())

    expect(screen.queryByTestId('end-status-warning')).not.toBeInTheDocument()
    userEvent.click(screen.getByRole('radio', { name: AFGEHANDELD.value }))
    expect(screen.getByTestId('end-status-warning')).toBeInTheDocument()
  })

  it('shows a warning when user has no email', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        reporter: { ...incidentFixture.reporter, email: null },
      })
    )

    userEvent.click(screen.getByRole('radio', { name: AFGEHANDELD.value }))
    expect(screen.getByTestId('no-email-warning')).toBeInTheDocument()
  })

  it('shows a warning when switching to reply status user has no email', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        reporter: { ...incidentFixture.reporter, email: null },
      })
    )

    userEvent.click(screen.getByRole('radio', { name: REACTIE_GEVRAAGD.value }))
    expect(screen.getByTestId('has-no-email-reply-warning')).toBeInTheDocument()
  })

  it('shows an explanation text when email will be sent', () => {
    render(renderWithContext())

    userEvent.click(screen.getByText('Afgehandeld'))

    expect(screen.queryByText(DEFAULT_TEXT_LABEL)).toBeInTheDocument()
  })

  it('shows a warning that is specific to a deelmelding', () => {
    const deelmelding = {
      ...incidentFixture,
      _links: {
        ...incidentFixture._links,
        'sia:parent': {
          href: 'https://acc.api.data.amsterdam.nl/signals/v1/private/categories/106',
          public:
            'https://acc.api.data.amsterdam.nl/signals/v1/public/terms/categories/civiele-constructies',
        },
      },
    }

    // render component with incident that has a parent
    render(renderWithContext(deelmelding))

    // verify that warning with text DEELMELDING_EXPLANATION is visible
    expect(screen.getByTestId('split-incident-warning').textContent).toEqual(
      DEELMELDING_EXPLANATION
    )

    // select a status that will show a warning
    userEvent.click(screen.getByRole('radio', { name: HEROPEND.value }))

    // verify that explanation with text DEELMELDING_EXPLANATION is visible
    expect(screen.getByTestId('split-incident-warning').textContent).toEqual(
      DEELMELDING_EXPLANATION
    )

    userEvent.click(screen.getByText(REACTIE_GEVRAAGD.value))
    expect(
      screen.getByTestId('split-incident-reply-warning')
    ).toBeInTheDocument()
  })

  it('shows a warning when there are child incidents still open', async () => {
    const childIncidents = [GEMELD, INGEPLAND].map(({ key }) => ({
      status: { state: key },
    }))
    render(renderWithContext(incidentFixture, childIncidents))

    expect(
      screen.queryByTestId('has-open-child-incidents-warning')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: AFGEHANDELD.value }))

    expect(
      screen.getByTestId('has-open-child-incidents-warning').textContent
    ).toContain(DEELMELDINGEN_STILL_OPEN_HEADING)
    expect(
      screen.getByTestId('has-open-child-incidents-warning').textContent
    ).toContain(DEELMELDINGEN_STILL_OPEN_CONTENT)

    userEvent.click(screen.getByRole('radio', { name: INGEPLAND.value }))

    expect(
      screen.queryByTestId('has-open-child-incidents-warning')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: GEANNULEERD.value }))
    expect(
      screen.getByTestId('has-open-child-incidents-warning').textContent
    ).toContain(DEELMELDINGEN_STILL_OPEN_CONTENT)
    expect(
      screen.getByTestId('has-open-child-incidents-warning').textContent
    ).toContain(DEELMELDINGEN_STILL_OPEN_HEADING)
  })

  it('shows NO warning when the child incidents are closed', async () => {
    const childIncidents = [AFGEHANDELD, GEANNULEERD].map(({ key }) => ({
      status: { state: key },
    }))

    render(renderWithContext(incidentFixture, childIncidents))

    expect(
      screen.queryByTestId('statusHasChildrenOpen')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: AFGEHANDELD.value }))

    expect(
      screen.queryByTestId('statusHasChildrenOpen')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: INGEPLAND.value }))

    expect(
      screen.queryByTestId('statusHasChildrenOpen')
    ).not.toBeInTheDocument()

    userEvent.click(screen.getByRole('radio', { name: GEANNULEERD.value }))

    expect(
      screen.queryByTestId('statusHasChildrenOpen')
    ).not.toBeInTheDocument()
  })

  it('is not possible to submit a status when an notification has level "error"', () => {
    render(
      renderWithContext({
        ...incidentFixture,
        reporter: {
          ...incidentFixture.reporter,
          email: null,
        },
      })
    )

    const submitButton = screen.getByRole('button', { name: 'Status opslaan' })

    expect(submitButton).not.toBeDisabled()
    userEvent.click(screen.getByRole('radio', { name: REACTIE_GEVRAAGD.value }))
    expect(submitButton).toBeDisabled()
  })
})
