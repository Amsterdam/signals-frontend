// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  margin: ${themeSpacing(8, 0)};
  justify-content: space-between;
`

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
`
export const DefaultTextBody = styled.div`
  line-height: 1.5rem;
  max-height: 9rem;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
`

export const TextWrapper = styled.div`
  display: flex;

  span {
    font-weight: 700;
    font-size: 1.125rem;
    margin-right: 8px;
  }
`

export const StyledButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level7')};

  & + button:not([disabled]) {
    margin-top: -1px;
  }
`
