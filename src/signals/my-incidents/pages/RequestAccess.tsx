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
      `De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een
    nieuwe bevestigingslink te ontvangen.`,
    ]}
  >
    <EmailInput />
  </BasePage>
)
