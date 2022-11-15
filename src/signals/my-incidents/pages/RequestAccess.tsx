// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { EmailInput } from '../components'
import { BasePage } from './BasePage'

export const RequestAccess = () => (
  <BasePage
    pageInfo={{
      documentTitle: 'Inloggen',
      dataTestId: 'requestAccessMyIncidents',
      pageTitle: 'Mijn meldingen',
    }}
    paragraphs={[
      `Log in met het e-mailadres waarmee u meldingen maakt. U krijgt dan een bevestigingsmail om naar het meldingenoverzicht te gaan.`,
    ]}
  >
    <EmailInput />
  </BasePage>
)
