// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import { useCallback } from 'react'

import Button from 'components/Button'
import BasePage from 'components/pages/BasePage'

import { StyledParagraph as Paragraph, ButtonWrapper } from './styled'

export const LinkExpired = () => {
  const onClick = useCallback(() => {
    // Redirect back to RequestAccess page
    console.log('onClick')
  }, [])

  return (
    <BasePage
      documentTitle="Bevestig e-mailadres"
      data-testid="confirmEmailAddressMyIncidents"
      pageTitle="Link verlopen"
    >
      <Paragraph fontSize={16}>
        De link om uw aanmelding te bevestigen is verlopen. Begin opnieuw om een
        nieuwe bevestigingslink te ontvangen.
      </Paragraph>

      <ButtonWrapper>
        <Button variant="secondary" onClick={onClick}>
          Begin opnieuw
        </Button>
      </ButtonWrapper>
    </BasePage>
  )
}
