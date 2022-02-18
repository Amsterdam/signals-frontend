// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import FormFooter from 'components/FormFooter'
import ModalHeader from '../ModalHeader/ModalHeader'

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFormFooter = styled(FormFooter)`
  height: auto;
  div {
    padding-left: ${themeSpacing(4)};
    div {
      padding-left: 0;
    }
  }
`

const StyledIframe = styled.iframe`
  border: none;
  padding-left: ${themeSpacing(2)};
  padding-bottom: ${themeSpacing(16)};
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
}) => (
  <ModalContainer>
    <ModalHeader title="Controleer bericht aan melder" onClose={onClose} />
    <StyledIframe
      data-testid="emailBodyIframe"
      srcDoc={emailBody.concat(fontStyling)}
      height={'500vh'}
    />
    <StyledFormFooter
      cancelBtnLabel="Wijzig"
      onCancel={onClose}
      submitBtnLabel="Verstuur"
      onSubmitForm={onUpdate}
    />
  </ModalContainer>
)

export default EmailPreview
