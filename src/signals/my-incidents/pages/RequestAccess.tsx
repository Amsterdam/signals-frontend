// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 - 2023 Gemeente Amsterdam
import { useEffect, useState } from 'react'

import { BasePage } from './BasePage'
import { LoginForm } from '../components'

export const RequestAccess = () => {
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    ;(window as any).dataLayer?.push({
      event: 'interaction.component.virtualPageview',
      meta: {
        vpv_url: `/mijn-meldingen/login`,
      },
    })
  }, [])

  return (
    <BasePage
      pageInfo={{
        documentTitle: 'Inloggen',
        dataTestId: 'requestAccessMyIncidents',
        pageTitle: 'Mijn meldingen',
      }}
      paragraphs={[
        `Log in met het e-mailadres waarmee u meldingen maakt. U krijgt dan een bevestigingsmail om naar het meldingenoverzicht te gaan.`,
      ]}
      errorMessage={errorMessage}
    >
      <LoginForm setErrorMessage={setErrorMessage} />
    </BasePage>
  )
}
