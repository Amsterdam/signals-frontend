// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { useCallback, useEffect, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import Button from 'components/Button'

import { BasePage } from './BasePage'
import { routes } from '../definitions'

export const LinkExpired = () => {
  const navigate = useNavigate()

  const onClick = useCallback(() => {
    navigate(`../${routes.requestAccess}`)
  }, [navigate])

  const buttons = useMemo(
    () => (
      <Button variant="secondary" onClick={onClick}>
        Begin opnieuw
      </Button>
    ),
    [onClick]
  )

  // TODO: IMPLEMENT PIWIK EVENT HERE
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(`virtualPageview: /mijn-meldingen/verlopen`)
  }, [])

  return (
    <BasePage
      buttons={buttons}
      pageInfo={{
        documentTitle: 'Link verlopen',
        dataTestId: 'expiredLinkMyIncidents',
        pageTitle: 'Link verlopen',
      }}
      paragraphs={[
        `De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een
    nieuwe bevestigingslink te ontvangen.`,
      ]}
    />
  )
}
