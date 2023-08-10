// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import styled from 'styled-components'

export const styling = `
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

export const StyledIframe = styled.iframe`
  border: none;
  width: 100%;
  // Set height manually to just over max height over content modal
  height: 76vh;
`
