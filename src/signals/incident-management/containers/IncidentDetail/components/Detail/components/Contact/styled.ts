// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import {
  Input,
  Link as AscLink,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import EditButton from '../../../EditButton'

export const StyledLink = styled(AscLink)`
  display: block;
  font-size: 1rem;
`

export const StyledEditButton = styled(EditButton)`
  top: ${themeSpacing(2)};
  z-index: 1;
`
export const EditFormWrapper = styled.div`
  padding: ${themeSpacing(5, 5, 6, 5)};
  margin-bottom: ${themeSpacing(6)};
  background-color: ${themeColor('tint', 'level2')};
  grid-row: span 2;
`

export const StyledForm = styled.form`
  display: grid;
  grid-gap: ${themeSpacing(6)};
`

export const StyledInput = styled(Input)<{ showError?: boolean }>`
  ${({ showError }) =>
    showError &&
    css`
      border: 2px solid ${themeColor('secondary')};
    `}

  // when ErrorMessage is sibling add margin-top 4px
  + div {
    margin-top: ${themeSpacing(1)};
  }
`

export const StyledDD = styled.dd`
  position: relative;
`

export const CancelFormWrapper = styled.div`
  padding: ${themeSpacing(5, 5, 6, 5)};
  margin-bottom: ${themeSpacing(6)};
  background-color: ${themeColor('tint', 'level2')};
  grid-row: span 2;
`
