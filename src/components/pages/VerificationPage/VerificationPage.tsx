// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { Link, useParams } from 'react-router-dom'

import { StyledButton, StyledLabel, StyledP } from './styled'
import { useFetch } from '../../../hooks'
import configuration from '../../../shared/services/configuration/configuration'
import BasePage from '../BasePage'

export function VerificationPage() {
  const { post, error, isSuccess } = useFetch()

  const params = useParams<{ token: string }>()

  useEffect(() => {
    post(`${configuration.EMAIL_VERIFICATION_ENDPOINT}`, {
      token: params.token,
    })
  }, [post, params.token])

  let button: ReactNode = (
    <>
      <StyledLabel>
        <strong>Wilt u nog een andere melding doen?</strong>
      </StyledLabel>
      <div>
        <StyledButton
          variant="primary"
          forwardedAs={Link}
          to="/incident/beschrijf"
        >
          Doe een melding
        </StyledButton>
      </div>
    </>
  )
  let paragraph = ''
  let documentTitle = ''
  if (isSuccess) {
    documentTitle = 'E-mailadres bevestigd'
    button = null
    paragraph = `Uw e-mailadres voor de melding is nu gewijzigd. U heeft hierover een e-mail gekregen. Heeft u de e-mail niet ontvangen? Controleer dan ook uw spamfolder.`
  } else if (error) {
    documentTitle = 'Link ongeldig'
    paragraph = `De link om uw e-mailadres te wijzigen is verlopen of ongeldig. Om een nieuwe verificatielink te ontvangen kunt u bellen met telefoonnummer 14 020, maandag tot en met vrijdag van 08.00 tot 18.00.`
  }

  return (
    <BasePage documentTitle={documentTitle} pageTitle={documentTitle}>
      <StyledP>{paragraph}</StyledP>
      {button}
    </BasePage>
  )
}
