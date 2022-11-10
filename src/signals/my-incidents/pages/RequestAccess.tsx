// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { EmailInput } from '../components'
import { BasePage } from './BasePage'

export const RequestAccess = () => (
  <BasePage
    pageInfo={{
      documentTitle: 'Inloggen Mijn Meldingen',
      dataTestId: 'requestAccessMyIncidents',
      pageTitle: 'Mijn meldingen',
    }}
    paragraphs={[
<<<<<<< HEAD
      `Log in met het e-mailadres waarmee u medlingen maakt. U krijgt dan een bevestigingsmail om naar het meldingenoverzicht te gaan.`,
=======
      `Login met het e-mailadres waarmee u meldingen maakt. U krijgt dan een bevestigingsmail om naar het meldingenoverzicht te gaan.`,
>>>>>>> bdd4da876 (mvp meldingen overzicht)
    ]}
  >
    <EmailInput />
  </BasePage>
)
