// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useMemo } from 'react'

import { EmailInput } from '../components'
import { BasePage } from './BasePage'

export const RequestAccess = () => {
  const pageInfo = useMemo(
    () => ({
      documentTitle: 'Inloggen Mijn Meldingen',
      dataTestId: 'requestAccessMyIncidents',
      pageTitle: 'Mijn meldingen',
    }),
    []
  )

  const paragraphs = useMemo(
    () => [
      `De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een
    nieuwe bevestigingslink te ontvangen.`,
    ],
    []
  )

  return (
    <BasePage pageInfo={pageInfo} paragraphs={paragraphs}>
      <EmailInput />
    </BasePage>
  )
}
