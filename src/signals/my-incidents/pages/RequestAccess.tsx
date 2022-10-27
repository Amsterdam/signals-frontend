// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import BasePage from 'components/pages/BasePage'

import { EmailInput } from '../components'
import { StyledParagraph as Paragraph } from './styled'
export const RequestAccess = () => {
  return (
    <BasePage
      documentTitle="Inloggen Mijn Meldingen"
      data-testid="requestAccessMyIncidents"
      pageTitle="Mijn meldingen"
    >
      <Paragraph fontSize={16}>
        Log in met het e-mailadres waarmee u meldingen maakt. U krijgt dan een
        bevestigingsmail om naar het meldingenoverzicht te gaan.
      </Paragraph>

      <EmailInput />
    </BasePage>
  )
}
