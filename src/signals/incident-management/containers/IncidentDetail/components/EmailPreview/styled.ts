// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import FormFooter from 'components/FormFooter'

import { FORM_FOOTER_HEIGHT } from 'components/FormFooter/FormFooter'

export const styling = `
<style>
  *{
    font-family: Amsterdam Sans, sans-serif;
    line-height: 22px;
    overflow-wrap: break-word;
    word-break: break-all;
    word-break: break-word;
    hyphens: auto;
    margin-left:0;
  }
</style>`

export const StyledFormFooter = styled(FormFooter)`
  .formFooterRow {
    padding-left: ${themeSpacing(4)};
  }
`

export const StyledIframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
  padding: 0 0 ${FORM_FOOTER_HEIGHT}px ${themeSpacing(0)};
`
