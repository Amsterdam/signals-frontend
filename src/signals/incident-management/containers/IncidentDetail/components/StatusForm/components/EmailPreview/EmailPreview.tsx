// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import FormFooter from 'components/FormFooter'
import ModalHeader from '../ModalHeader/ModalHeader'

const formFooterHeight = 16
const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledFormFooter = styled(FormFooter)`
  height: auto;
  div.formFooterRow {
    padding-left: ${themeSpacing(4)};
  }
`

const StyledIframe = styled.iframe`
  border: none;
  padding: ${themeSpacing(2, 0, formFooterHeight)};
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
      height="500"
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
