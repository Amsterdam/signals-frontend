// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam
import type { FC } from 'react'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import FormFooter from 'components/FormFooter'
import { FORM_FOOTER_HEIGHT } from 'components/FormFooter/FormFooter'
import ModalHeader from '../ModalHeader/ModalHeader'

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  * {
    box-sizing: border-box;
  }
`

const StyledFormFooter = styled(FormFooter)`
  .formFooterRow {
    padding-left: ${themeSpacing(4)};
  }
`

const StyledIframe = styled.iframe`
  border: none;
  padding: 0 0 ${FORM_FOOTER_HEIGHT}px ${themeSpacing(2)};
  width: 100%;
  height: 100%;
`

interface EmailPreviewProps {
  emailBody: string
  onClose: () => void
  onUpdate: () => void
}

const styling = '<style>*{font-family:"Avenir Next";}</style>'
const fontSrc =
  '<link rel="stylesheet" href="https://static.amsterdam.nl/fonts/fonts.css"/>'

const EmailPreview: FC<EmailPreviewProps> = ({
  emailBody,
  onUpdate,
  onClose,
}) => {
  const styledHtml = emailBody.replace('</head>', `${fontSrc}${styling}</head>`)

  return (
    <ModalContainer>
      <ModalHeader title="Controleer bericht aan melder" onClose={onClose} />
      <StyledIframe data-testid="emailBodyIframe" srcDoc={styledHtml} />
      <StyledFormFooter
        cancelBtnLabel="Wijzig"
        onCancel={onClose}
        submitBtnLabel="Verstuur"
        onSubmitForm={onUpdate}
      />
    </ModalContainer>
  )
}

export default EmailPreview
