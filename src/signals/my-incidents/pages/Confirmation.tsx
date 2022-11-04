// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useState, useCallback, useMemo } from 'react'

import { useHistory } from 'react-router-dom'

import Button from 'components/Button'

import { useMyIncidentContext } from '../context/context'
import { routes } from '../definitions'
import { usePostEmail } from '../hooks'
import { BasePage } from './BasePage'

export const Confirmation = () => {
  const { email } = useMyIncidentContext()
  const history = useHistory()
  const [postEmail] = usePostEmail()

  const initialPageInfo = {
    documentTitle: 'Bevestig e-mailadres',
    dataTestId: 'confirmEmailAddressMyIncidents',
    pageTitle: 'Bevestig uw e-mailadres',
  }

  const initialParagraphs = [
    `Wij hebben een e-mail verstuurd naar ${email}. Bevestig uw e-mailadres
      met de link in de e-mail. Het kan zijn dat de e-mail in uw spamfolder
      staat.`,
    `Hebt u geen bevestigingsmail ontvangen? Controleer uw e-mailadres en
      verstuur opnieuw.`,
  ]

  const [paragraphs, setParagraphs] = useState(initialParagraphs)
  const [pageInfo, setPageInfo] = useState(initialPageInfo)

  const onResubmit = useCallback(() => {
    if (email) {
      postEmail(email)
      setPageInfo({
        documentTitle: 'Opnieuw verstuurd',
        dataTestId: 'resendEmailAddressMyIncidents',
        pageTitle: 'Opnieuw verstuurd',
      })
      setParagraphs([
        `Wij hebben opnieuw een e-mail verstuurd naar ${email}. Bevestig uw e-mailadres met de link in de e-mail. Het kan zijn dat de e-mail in uw spamfolder staat.`,
        `Hebt u geen bevestigingsmail ontvangen? Controleer uw e-mailadres en
        verstuur opnieuw.`,
      ])
    }
  }, [email, postEmail])

  const onCancel = useCallback(() => {
    history.push(routes.requestAccess)
  }, [history])

  const buttons = useMemo(
    () => (
      <>
        <Button variant="secondary" onClick={onResubmit}>
          Verstuur opnieuw
        </Button>
        <Button variant="primaryInverted" onClick={onCancel}>
          Annuleren
        </Button>
      </>
    ),
    [onCancel, onResubmit]
  )

  return (
    <BasePage buttons={buttons} pageInfo={pageInfo} paragraphs={paragraphs} />
  )
}
