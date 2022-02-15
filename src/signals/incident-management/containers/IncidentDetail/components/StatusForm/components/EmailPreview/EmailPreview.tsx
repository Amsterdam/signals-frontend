// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'
import styled from 'styled-components'
import Button from 'components/Button'
import { themeColor, themeSpacing } from '@amsterdam/asc-ui'
import ModalHeader from '../ModalHeader/ModalHeader'

const ButtonWrapper = styled.div`
  box-sizing: border-box;
  padding: ${themeSpacing(4)};
  border-top: 1px solid ${themeColor('tint', 'level4')};
`

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledButton = styled(Button)`
  height: ${themeSpacing(11)};
  margin-right: ${themeSpacing(2)};
`

const StyledIframe = styled.iframe`
  border: none;
  padding-left: ${themeSpacing(2)};
`

interface EmailPreviewProps {
  emailBody: string
  onClose: () => void
  onUpdate: () => void
}

const fontStyling = '<style>*{font-family:Avenir Next;}</style>'

const EmailPreview: FC<EmailPreviewProps> = ({
  emailBody,
  onUpdate,
  onClose,
}) => {
  return (
    <ModalContainer>
      <ModalHeader title="Controleer bericht aan melder" onClose={onClose} />
      <StyledIframe
        data-testid="emailBodyIframe"
        srcDoc={emailBody.concat(fontStyling)}
        height={'500vh'}
      />
      <ButtonWrapper>
        <StyledButton
          data-testid="emailPreviewSubmitButton"
          type="submit"
          variant="secondary"
          onClick={onUpdate}
        >
          Verstuur
        </StyledButton>

        <StyledButton
          data-testid="emailPreviewCancelButton"
          variant="tertiary"
          onClick={onClose}
        >
          Wijzig
        </StyledButton>
      </ButtonWrapper>
    </ModalContainer>
  )
}

export default EmailPreview
