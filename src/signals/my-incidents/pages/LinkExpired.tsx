// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useMemo } from 'react'

import { useHistory } from 'react-router-dom'

import Button from 'components/Button'

import { routes } from '../definitions'
import { BasePage } from './BasePage'

export const LinkExpired = () => {
  const history = useHistory()

  const onClick = useCallback(() => {
    history.push(routes.requestAccess)
  }, [history])

  const buttons = useMemo(
    () => (
      <Button variant="secondary" onClick={onClick}>
        Begin opnieuw
      </Button>
    ),
    [onClick]
  )

  const pageInfo = useMemo(
    () => ({
      documentTitle: 'Link verlopen',
      dataTestId: 'expiredLinkMyIncidents',
      pageTitle: 'Link verlopen',
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
    <BasePage buttons={buttons} pageInfo={pageInfo} paragraphs={paragraphs} />
  )
}
