// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { Link, useParams } from 'react-router-dom'

import { StyledButton, StyledButtonDescription, StyledP } from './styled'
import { useFetch } from '../../../hooks'
import configuration from '../../../shared/services/configuration/configuration'
import LoadingIndicator from '../../LoadingIndicator'
import BasePage from '../BasePage'

export function VerificationPage() {
  const { post, error, isSuccess, isLoading } = useFetch()

  const params = useParams<{ token: string }>()

  useEffect(() => {
    post(`${configuration.EMAIL_VERIFICATION_ENDPOINT}`, {
      token: params.token,
    })
  }, [post, params.token])

  let button: ReactNode = null
  let paragraph = ''
  let documentTitle = ''
  if (isSuccess) {
    documentTitle = 'E-mailadres bevestigd'
    paragraph = `Uw e-mailadres voor de melding is nu gewijzigd. U heeft hierover een e-mail gekregen. Heeft u de e-mail niet ontvangen? Controleer dan ook uw spamfolder.`
  } else if (error) {
    button = (
      <>
        <StyledButtonDescription id={'verify-email-button'}>
          <strong>Wilt u nog een andere melding doen?</strong>
        </StyledButtonDescription>
        <div>
          <StyledButton
            aria-describedby={'verify-email-button'}
            variant="primary"
            forwardedAs={Link}
            to="/incident/beschrijf"
          >
            Doe een melding
          </StyledButton>
        </div>
      </>
    )
    documentTitle = 'Link ongeldig'
    paragraph = `De link om uw e-mailadres te wijzigen is verlopen of ongeldig. Om een nieuwe verificatielink te ontvangen kunt u bellen met telefoonnummer 14 020, maandag tot en met vrijdag van 08.00 tot 18.00.`
  }

  return (
    <BasePage documentTitle={documentTitle} pageTitle={documentTitle}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <StyledP>{paragraph}</StyledP>
          {button}
        </>
      )}
    </BasePage>
  )
}
