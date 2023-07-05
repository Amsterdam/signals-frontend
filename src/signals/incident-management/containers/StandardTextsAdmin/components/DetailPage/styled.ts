// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam

import { Label, themeSpacing, themeColor, Column } from '@amsterdam/asc-ui'
import styled, { css } from 'styled-components'

import FormFooter from 'components/FormFooter'
import TextArea from 'components/TextArea'

export const StyledFormFooter = styled(FormFooter)`
  box-sizing: border-box;
  position: fixed;
`

export const StyledLabel = styled(Label)`
  font-weight: 400;
  margin-top: -${themeSpacing(2.25)}; //first child has margin-top of 9px but distance to above element needs to be 24px
`

export const StyledTextArea = styled(TextArea)<{ showError: boolean }>`
  resize: none;
  min-height: 200px;
  ${({ showError }) =>
    showError &&
    css`
      & {
        border: 2px solid ${themeColor('secondary')};
      }
    `}
`

export const StyledHeading = styled.div`
  font-weight: 700;
`

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 1fr;
  grid-column-gap: ${themeSpacing(6)};
  justify-content: space-between;
`

export const Form = styled.form`
  width: 100%;
`

export const LeftSection = styled.div``

export const RightSection = styled.div`
  > * {
    margin-bottom: ${themeSpacing(6)};
  }
`
export const StyledColumn = styled(Column)`
  flex-direction: column;
`
