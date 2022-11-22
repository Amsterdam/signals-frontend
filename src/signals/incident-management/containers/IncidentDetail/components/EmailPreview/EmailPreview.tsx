// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 Gemeente Amsterdam, Vereniging van Nederlandse Gemeenten
import type { FC } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from 'components/FormFooter'
import { FORM_FOOTER_HEIGHT } from 'components/FormFooter/FormFooter'
import LoadingIndicator from 'components/LoadingIndicator'

import ModalDialog from '../ModalDialog/ModalDialog'

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
  emailBody?: string
  onClose: () => void
  onUpdate: () => void
  title: string
  isLoading: boolean
}

const styling = `
<style>
  *{
    font-family: Amsterdam Sans, sans-serif;
    line-height: 22px;
    overflow-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
  }
</style>`
const fontSrc =
  '<link rel="stylesheet" href="https://static.amsterdam.nl/fonts/fonts.css"/>'

const EmailPreview: FC<EmailPreviewProps> = ({
  emailBody,
  onUpdate,
  onClose,
  title,
  isLoading,
}) => {
  const styledHtml = emailBody?.replace(
    '</head>',
    `${fontSrc}${styling}</head>`
  )

  return (
    <ModalDialog
      data-testid="emailPreviewModal"
      title={title}
      onClose={onClose}
    >
      {isLoading && <LoadingIndicator />}
      {emailBody && (
        <>
          <StyledIframe data-testid="emailBodyIframe" srcDoc={styledHtml} />
          <StyledFormFooter
            cancelBtnLabel="Wijzig"
            onCancel={onClose}
            submitBtnLabel="Verstuur"
            onSubmitForm={onUpdate}
          />
        </>
      )}
    </ModalDialog>
  )
}

export default EmailPreview
