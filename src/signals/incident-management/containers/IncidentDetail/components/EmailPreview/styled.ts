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
    word-break: break-all;
    hyphens: auto;
    margin-left:0;
  }
</style>`

export const StyledFormFooter = styled(FormFooter)`
  height: auto;
  padding-left: ${themeSpacing(7)};
  padding-bottom: ${themeSpacing(4)};
  .formFooterRow {
    padding-left: ${themeSpacing(0)};
  }
`

export const StyledIframe = styled.iframe`
  border: none;
  width: 100%;
  height: 100%;
  padding: 0 0 ${FORM_FOOTER_HEIGHT}px ${themeSpacing(0)};
`
