// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { themeSpacing } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div<{ $hasIframe: boolean }>`
  height: 100%;
  padding: ${themeSpacing(4)};
  overflow-wrap: break-word;

  // iFrame has internal scroll bars
  ${({ $hasIframe }) =>
    $hasIframe
      ? css`
          overflow: 'clip';
          padding-top: ${themeSpacing(0)};
          padding-right: ${themeSpacing(0)};
        `
      : css`
          overflow: auto;
          padding-right: ${themeSpacing(4)};
        `}
`

export const Content = styled.div`
  height: 100%;
`
