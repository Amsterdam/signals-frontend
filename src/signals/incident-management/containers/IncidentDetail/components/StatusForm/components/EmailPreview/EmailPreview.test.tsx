// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { withAppContext } from 'test/utils'
import EmailPreview from './EmailPreview'

const emailBody =
  '<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Uw melding SIA-1</title></head><body><p>Geachte melder,</p><p>Op 9 februari 2022 om 13.00 uur hebt u een melding gedaan bij de gemeente. In deze e-mail leest u de stand van zaken van uw melding.</p><p><strong>U liet ons het volgende weten</strong><br />Just some text<br /> Some text on the next line</p><p><strong>Stand van zaken</strong><br />Wij pakken dit z.s.m. op</p><p><strong>Gegevens van uw melding</strong><br />Nummer: SIA-1<br />Gemeld op: 9 februari 2022, 13.00 uur<br />Plaats: Amstel 1, 1011 PN Amsterdam</p><p><strong>Meer weten?</strong><br />Voor vragen over uw melding in Amsterdam kunt u bellen met telefoonnummer 14 020, maandag tot en met vrijdag van 08.00 tot 18.00 uur. Voor Weesp kunt u bellen met 0294 491 391, maandag tot en met vrijdag van 08.30 tot 17.00 uur. Geef dan ook het nummer van uw melding door: SIA-1.</p><p>Met vriendelijke groet,</p><p>Gemeente Amsterdam</p></body></html>'

describe('StatusForm EmailPreview component', () => {
  const onUpdate = jest.fn()
  const onClose = jest.fn()

  it('renders the email preview and calls onUpdate when the send button is hit', () => {
    render(
      withAppContext(
        <EmailPreview
          onUpdate={onUpdate}
          emailBody={emailBody}
          onClose={onClose}
        />
      )
    )

    expect(
      screen.queryByText('Controleer bericht aan melder')
    ).toBeInTheDocument()
    expect(screen.getByTitle('Sluiten')).toBeInTheDocument()
    expect(screen.queryByTestId('emailBodyIframe')).toBeInTheDocument()
    expect(screen.getByText('Wijzig')).toBeInTheDocument()

    userEvent.click(screen.getByText('Verstuur'))
    expect(onUpdate).toHaveBeenCalled()
  })

  it('calls onClose when the cancel button is hit', () => {
    render(
      withAppContext(
        <EmailPreview
          onUpdate={onUpdate}
          emailBody={emailBody}
          onClose={onClose}
        />
      )
    )

    userEvent.click(screen.getByText('Wijzig'))
    expect(onClose).toHaveBeenCalled()
  })
})
