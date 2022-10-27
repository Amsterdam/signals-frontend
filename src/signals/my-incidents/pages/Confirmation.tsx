// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback, useState } from 'react'

import { useHistory } from 'react-router-dom'

import Button from 'components/Button'
import BasePage from 'components/pages/BasePage'

import { routes } from '../definitions'
import { usePostEmail } from '../hooks'
import { StyledParagraph as Paragraph, ButtonWrapper } from './styled'
interface Props {
  email: string
}

export const Confirmation = ({ email = 'janjanssen@ziggo.nl' }: Props) => {
  const history = useHistory()

  const [pageTitle, setPageTitle] = useState('Bevestig uw e-mailadres')
  const [postEmail] = usePostEmail()

  const onResubmit = useCallback(() => {
    postEmail(email)
    setPageTitle('Opnieuw verstuurd')
  }, [email, postEmail])

  const onCancel = useCallback(() => {
    history.push(routes.requestAccess)
  }, [history])

  return (
    <BasePage
      documentTitle="Bevestig e-mailadres"
      data-testid="confirmEmailAddressMyIncidents"
      pageTitle={pageTitle}
    >
      <Paragraph fontSize={16}>
        Wij hebben een e-mail verstuurd naar {email}. Bevestig uw e-mailadres
        met de link in de e-mail. Het kan zijn dat de e-mail in uw spamfolder
        staat.
      </Paragraph>
      <Paragraph fontSize={16}>
        Hebt u geen bevestigingsmail ontvangen? Controleer uw e-mailadres en
        verstuur opnieuw.
      </Paragraph>

      <ButtonWrapper>
        <Button variant="secondary" onClick={onResubmit}>
          Verstuur opnieuw
        </Button>
        <Button variant="primaryInverted" onClick={onCancel}>
          Annuleren
        </Button>
      </ButtonWrapper>
    </BasePage>
  )
}
